from django.test import TestCase
from team.models import TeamMember
from team.serializers import TeamMemberSerializer

class TeamMemberSerializerTest(TestCase):
    def setUp(self):
        # Set up any objects you need for the tests
        self.team_member_attributes = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'phone': '(123) 456-7890',
            'role': 'regular'
        }
        
        self.serializer_data = {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': '   JANE.DOE@example.com ',
            'phone': '(987) 654-3210',
            'role': 'admin'
        }
        
        self.team_member = TeamMember.objects.create(**self.team_member_attributes)
        self.serializer = TeamMemberSerializer(instance=self.team_member)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        
        self.assertEqual(set(data.keys()), set(['id', 'first_name', 'last_name', 'email', 'phone', 'role']))
        
    def test_phone_field_format(self):
        serializer = TeamMemberSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        
        invalid_data = self.serializer_data.copy()
        invalid_data['phone'] = '1234567890'  # Invalid phone format
        serializer = TeamMemberSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('phone', serializer.errors)

    def test_first_name_not_empty(self):
        invalid_data = self.serializer_data.copy()
        invalid_data['first_name'] = ''
        serializer = TeamMemberSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('first_name', serializer.errors)

    def test_last_name_not_empty(self):
        invalid_data = self.serializer_data.copy()
        invalid_data['last_name'] = ''
        serializer = TeamMemberSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('last_name', serializer.errors)
        
    def test_email_normalization_and_uniqueness(self):
        # Testing normalization
        serializer = TeamMemberSerializer(data=self.serializer_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['email'], 'jane.doe@example.com')

        serializer.save()
        
        # Testing uniqueness
        duplicate_email_data = self.serializer_data.copy()
        serializer = TeamMemberSerializer(data=duplicate_email_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

