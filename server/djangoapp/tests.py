import json

from django.contrib.auth.models import User
from django.test import TestCase


class AuthenticationFlowTests(TestCase):
    def register(self):
        return self.client.post(
            "/djangoapp/register",
            data=json.dumps({
                "userName": "flow-user",
                "password": "local-test-password",
                "firstName": "Flow",
                "lastName": "User",
                "email": "flow@example.com",
            }),
            content_type="application/json",
        )

    def test_registration_creates_user_without_authenticating(self):
        response = self.register()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "Registered")
        self.assertTrue(User.objects.filter(username="flow-user").exists())
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_registered_user_can_login_and_logout(self):
        self.register()
        login_response = self.client.post(
            "/djangoapp/login",
            data=json.dumps({
                "userName": "flow-user",
                "password": "local-test-password",
            }),
            content_type="application/json",
        )

        self.assertEqual(login_response.json()["status"], "Authenticated")
        self.assertIn("_auth_user_id", self.client.session)

        logout_response = self.client.get("/djangoapp/logout")

        self.assertEqual(logout_response.status_code, 200)
        self.assertNotIn("_auth_user_id", self.client.session)
        self.assertTrue(User.objects.filter(username="flow-user").exists())
