# team/tests/test_models.py
from django.test import TestCase
from django.utils import timezone
from team.models import TeamMember

class TeamMemberModelTests(TestCase):

    @classmethod
    def setUpTestData(cls):
        # Create a TeamMember object to use in tests
        cls.team_member = TeamMember.objects.create(
            first_name='John',
            last_name='Doe',
            email='johndoe@example.com',
            phone='1234567890',
            role=TeamMember.REGULAR
        )

    def test_team_member_creation(self):
        self.assertEqual(TeamMember.objects.count(), 1)
        member = TeamMember.objects.get(id=self.team_member.id)
        self.assertEqual(member.first_name, 'John')
        self.assertEqual(member.last_name, 'Doe')
        self.assertEqual(member.email, 'johndoe@example.com')
        self.assertEqual(member.phone, '1234567890')
        self.assertEqual(member.role, TeamMember.REGULAR)
        self.assertFalse(member.is_deleted)

    def test_str_method(self):
        self.assertEqual(str(self.team_member), 'John Doe')

    def test_custom_delete_method(self):
        self.assertFalse(self.team_member.is_deleted)
        self.assertIsNone(self.team_member.deleted_at)

        self.team_member.delete()

        # Refresh the object from the database
        self.team_member.refresh_from_db()

        self.assertTrue(self.team_member.is_deleted)
        self.assertIsNotNone(self.team_member.deleted_at)
        self.assertTrue(timezone.now() - self.team_member.deleted_at < timezone.timedelta(seconds=1))

