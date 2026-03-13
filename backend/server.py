from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth, firestore, storage
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Initialize Firebase Admin (will need credentials from user)
try:
    firebase_cred_path = os.environ.get(
        "FIREBASE_ADMIN_CREDENTIALS", "firebase-admin.json"
    )
    if os.path.exists(firebase_cred_path):
        cred = credentials.Certificate(firebase_cred_path)
        firebase_admin.initialize_app(
            cred,
            {
                "storageBucket": os.environ.get(
                    "FIREBASE_STORAGE_BUCKET", "healthos.appspot.com"
                )
            },
        )
        firestore_client = firestore.client()
        storage_bucket = storage.bucket()
        FIREBASE_ENABLED = True
        logging.info("Firebase initialized successfully")
    else:
        FIREBASE_ENABLED = False
        logging.warning("Firebase credentials not found. Running in mock mode.")
except Exception as e:
    FIREBASE_ENABLED = False
    logging.warning(f"Firebase initialization failed: {e}. Running in mock mode.")

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# Models
class UserRegister(BaseModel):
    name: str
    age: int
    gender: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    uid: str
    name: str
    age: int
    gender: str
    email: str
    created_at: str


class SOAPNote(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str

    subjective: str
    objective: str
    assessment: str
    plan: str

    audio_url: Optional[str] = None
    transcript: Optional[str] = None

    ml_status: str = "pending"

    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class SOAPNoteCreate(BaseModel):
    title: str
    subjective: str
    objective: str
    assessment: str
    plan: str


# Auth Middleware
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials

    if FIREBASE_ENABLED:
        try:
            decoded_token = firebase_auth.verify_id_token(token)
            return decoded_token
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    else:
        # Mock authentication for development
        user_doc = await db.users.find_one({"mock_token": token}, {"_id": 0})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_doc


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@api_router.get("/")
async def root():
    return {"message": "HealthOS API", "firebase_enabled": FIREBASE_ENABLED}


@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if FIREBASE_ENABLED:
        try:
            # Create Firebase user
            firebase_user = firebase_auth.create_user(
                email=user_data.email,
                password=user_data.password,
                display_name=user_data.name,
            )

            # Store additional user data in Firestore
            user_profile = {
                "uid": firebase_user.uid,
                "name": user_data.name,
                "age": user_data.age,
                "gender": user_data.gender,
                "email": user_data.email,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }

            firestore_client.collection("users").document(firebase_user.uid).set(
                user_profile
            )

            return {"message": "User registered successfully", "uid": firebase_user.uid}
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        # Mock mode - store in MongoDB
        hashed_password = bcrypt.hashpw(
            user_data.password.encode("utf-8"), bcrypt.gensalt()
        )
        uid = str(uuid.uuid4())
        mock_token = str(uuid.uuid4())

        user_profile = {
            "uid": uid,
            "name": user_data.name,
            "age": user_data.age,
            "gender": user_data.gender,
            "email": user_data.email,
            "password_hash": hashed_password.decode("utf-8"),
            "mock_token": mock_token,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        await db.users.insert_one(user_profile)

        return {
            "message": "User registered successfully",
            "uid": uid,
            "token": mock_token,
        }


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    if FIREBASE_ENABLED:
        # Note: Firebase Auth is typically done on the client side
        # This endpoint is for custom token generation if needed
        user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"message": "Please use Firebase client SDK for authentication"}
    else:
        # Mock mode
        user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
        if not user_doc:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not bcrypt.checkpw(
            credentials.password.encode("utf-8"),
            user_doc["password_hash"].encode("utf-8"),
        ):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "token": user_doc["mock_token"],
            "user": {
                "uid": user_doc["uid"],
                "name": user_doc["name"],
                "email": user_doc["email"],
                "age": user_doc["age"],
                "gender": user_doc["gender"],
            },
        }


@api_router.get("/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    uid = current_user.get("uid") or current_user.get("user_id")

    if FIREBASE_ENABLED:
        user_ref = firestore_client.collection("users").document(uid)
        user_doc = user_ref.get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        return user_doc.to_dict()
    else:
        user_doc = await db.users.find_one(
            {"uid": uid}, {"_id": 0, "password_hash": 0, "mock_token": 0}
        )
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")
        return user_doc


@api_router.put("/user/profile")
async def update_profile(
    profile_data: dict, current_user: dict = Depends(get_current_user)
):
    uid = current_user.get("uid") or current_user.get("user_id")

    # Remove sensitive fields
    profile_data.pop("password", None)
    profile_data.pop("email", None)

    if FIREBASE_ENABLED:
        user_ref = firestore_client.collection("users").document(uid)
        user_ref.update(profile_data)
    else:
        await db.users.update_one({"uid": uid}, {"$set": profile_data})

    return {"message": "Profile updated successfully"}


@api_router.get("/reports", response_model=List[SOAPNote])
async def get_reports(current_user: dict = Depends(get_current_user)):
    uid = current_user.get("uid") or current_user.get("user_id")

    if FIREBASE_ENABLED:
        reports_ref = firestore_client.collection("reports").where("user_id", "==", uid)
        reports = [doc.to_dict() for doc in reports_ref.stream()]
    else:
        reports = await db.reports.find({"user_id": uid}, {"_id": 0}).to_list(1000)

    # Sort by created_at descending
    reports.sort(key=lambda x: x["created_at"], reverse=True)

    return reports


@api_router.get("/reports/{report_id}", response_model=SOAPNote)
async def get_report(report_id: str, current_user: dict = Depends(get_current_user)):
    uid = current_user.get("uid") or current_user.get("user_id")

    if FIREBASE_ENABLED:
        doc_ref = firestore_client.collection("reports").document(report_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Report not found")
        report = doc.to_dict()
    else:
        report = await db.reports.find_one({"id": report_id}, {"_id": 0})
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")

    # Verify ownership
    if report["user_id"] != uid:
        raise HTTPException(status_code=403, detail="Access denied")

    return report


@api_router.delete("/reports/{report_id}")
async def delete_report(report_id: str, current_user: dict = Depends(get_current_user)):
    uid = current_user.get("uid") or current_user.get("user_id")

    if FIREBASE_ENABLED:
        doc_ref = firestore_client.collection("reports").document(report_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Report not found")
        report = doc.to_dict()
        if report["user_id"] != uid:
            raise HTTPException(status_code=403, detail="Access denied")
        doc_ref.delete()
    else:
        result = await db.reports.delete_one({"id": report_id, "user_id": uid})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")

    return {"message": "Report deleted successfully"}


from fastapi import Form


@api_router.post("/upload-audio")
async def upload_audio(
    file: UploadFile = File(...),
    transcript: str = Form(...),
    current_user: dict = Depends(get_current_user),
):
    if not FIREBASE_ENABLED:
        raise HTTPException(status_code=500, detail="Firebase not configured")

    uid = current_user.get("uid") or current_user.get("user_id")

    # Prevent empty transcript
    if not transcript or transcript.strip() == "":
        raise HTTPException(
            status_code=400, detail="Transcript is empty. Please record some speech."
        )

    # Prevent duplicate uploads within 5 seconds
    recent_reports = (
        firestore_client.collection("reports")
        .where("user_id", "==", uid)
        .order_by("created_at", direction="DESCENDING")
        .limit(1)
        .stream()
    )

    for r in recent_reports:
        last_report = r.to_dict()
        last_time = datetime.fromisoformat(last_report["created_at"])
        now = datetime.now(timezone.utc)

        if (now - last_time).total_seconds() < 5:
            raise HTTPException(
                status_code=429,
                detail="Please wait before uploading another recording.",
            )

    # Allowed audio formats
    allowed_extensions = ["webm", "wav", "mp3", "m4a"]
    file_extension = file.filename.split(".")[-1].lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format. Allowed formats: webm, wav, mp3, m4a",
        )

    # Limit file size to 10MB
    MAX_FILE_SIZE = 10 * 1024 * 1024

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, detail="File too large. Maximum allowed size is 10MB."
        )

    try:
        # Generate unique id
        file_id = str(uuid.uuid4())

        # Firebase storage path
        blob_path = f"audio/{uid}/{file_id}.{file_extension}"
        blob = storage_bucket.blob(blob_path)

        # Upload file to Firebase Storage
        blob.upload_from_string(file_content, content_type=file.content_type)

        # Make file public
        blob.make_public()
        audio_url = blob.public_url

        # Create SOAP note
        soap_note = SOAPNote(
            user_id=uid,
            title=f"Clinical Note - {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}",
            subjective="",
            objective="",
            assessment="",
            plan="",
            audio_url=audio_url,
            transcript=transcript,
            ml_status="pending",
        )

        doc = soap_note.model_dump()

        # Save to Firestore
        firestore_client.collection("reports").document(doc["id"]).set(doc)

        return {
            "message": "Audio uploaded successfully",
            "audio_url": audio_url,
            "report": soap_note,
        }

    except Exception as e:
        print("UPLOAD ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(api_router)
