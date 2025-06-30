Here’s an updated README including a **Testing** section with instructions and sample test info based on the tests I just gave you:

---

# 👫 CouplesGames

An online **Would You Rather** game platform enabling couples and friends to connect and play in real time, built with modern clean backend practices.

---

## 🚀 **Tech Stack**

| Layer                       | Technology                 |
| --------------------------- | -------------------------- |
| **API Framework**           | ASP.NET Core 8 Web API     |
| **Cloud DB**                | Firebase Firestore         |
| **Auth**                    | Firebase Authentication    |
| **Background Tasks**        | IHostedService (Self-ping) |
| **CQRS + Mediator Pattern** | MediatR                    |
| **Dependency Injection**    | .NET DI                    |
| **Logging**                 | Firestore error collection |

---

## 🗂 **Project Structure**

```
CouplesGames.sln
 ├── CouplesGames.Core        # Entities, Interfaces, Domain models
 ├── CouplesGames.Infrastructure # Firebase services, Self-ping background service
 ├── CouplesGames.Application # MediatR Commands, Queries, Handlers
 └── CouplesGames.WebAPI      # Controllers, Program.cs, API setup
```

### ✔ **Core**

* Domain entities (`Room`, `Question`)
* Service interfaces (`IFirebaseAuthService`, `IFirestoreService`)

### ✔ **Infrastructure**

* `FirebaseAuthService`: validates Firebase tokens
* `FirestoreService`: CRUD for rooms/questions + logs errors to Firestore
* `SelfPingHostedService`: pings the app every 12 mins to keep it warm

### ✔ **Application**

* **CQRS implementation** using MediatR:

  * **Commands**: `CreateRoomCommand`, `JoinRoomCommand`
  * **Queries**: `GetSoloWYRQuestionsQuery`, `HealthCheckQuery`
* Handlers contain **try-catch** blocks with Firestore logging for robust observability.

### ✔ **WebAPI**

* Controllers route requests to **MediatR** handlers
* Uses `Program.cs` to register all services and configure CORS, Swagger, HTTPS, etc.

---

## 🔑 **Environment Variables**

| Variable                               | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64` | Base64 encoded Firebase service account JSON |
| `FIREBASE_PROJECT_ID`                  | Firebase project ID                          |
| `FRONTEND_URL`                         | URL of the deployed frontend app             |
| `SELF_PING_URL`                        | URL for the self-ping background service     |

---

## 🛠 **Running Locally**

1. **Clone the repository**

```bash
git clone <repo-url>
cd CouplesGames
```

2. **Setup your environment variables**

* Create a `.env` file in `CouplesGames.WebAPI`:

```
FIREBASE_SERVICE_ACCOUNT_JSON_BASE64=...
FIREBASE_PROJECT_ID=...
FRONTEND_URL=http://localhost:3000
SELF_PING_URL=https://localhost:7195/api/health
```

3. **Run the solution**

```bash
dotnet build
dotnet run --project CouplesGames.WebAPI
```

4. Visit `https://localhost:7195/swagger` for Swagger UI.

---

## 🧪 **Testing**

Unit tests are provided for the Application layer command and query handlers using **xUnit** and **Moq**. These tests verify business logic and error handling.

### Running Tests

1. Create and set up the test project (if not already):

```bash
dotnet new xunit -n CouplesGames.Tests
dotnet add CouplesGames.Tests reference CouplesGames.Application
dotnet add package Moq
```

2. Run tests:

```bash
dotnet test CouplesGames.Tests
```

### Included Test Coverage

* **CreateRoomCommandHandler**: Ensures room creation with correct user and question IDs.
* **JoinRoomCommandHandler**: Validates user joining logic, prevents overcapacity.
* **GetSoloWYRQuestionsQueryHandler**: Returns the expected question list.
* **HealthCheckQueryHandler**: Tests Firestore connectivity success and failure cases.

---

## ✅ **Design Decisions**

* **CQRS + MediatR** separates read/write logic for clean maintainability.
* **Try-catch with Firestore logging** in all handlers improves production observability.
* **Self-ping Hosted Service** prevents the app from sleeping on free cloud hosting.

---

## 💡 **Future Improvements**

* Add **integration tests** with Firebase emulator or staging
* Implement **SignalR** for real-time multiplayer room updates
* Deploy via **Render or Vercel serverless functions**

---

### 👨‍💻 **Contributors**

| Name          | Role           |
| ------------- | -------------- |
| Vukosi Moyane | Lead Developer |

---

If you want me to help scaffold integration or controller tests next, or add CI/CD test workflows, just ask!
