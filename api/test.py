import asyncio
import services.auth_service as auth_service

async def test_handle_token_expiration():
    authService = auth_service.AuthService()
    await authService.handle_token_expiration()

if __name__ == "__main__":
    asyncio.run(test_handle_token_expiration())
