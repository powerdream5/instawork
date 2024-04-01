from rest_framework import serializers
from .models import TeamMember
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

class TeamMemberSerializer(serializers.ModelSerializer):
    phone_regex = RegexValidator(
        regex=r'^\(\d{3}\) \d{3}-\d{4}$',
        message="Phone number must be entered in the format: '(999) 999-9999'."
    )
    phone = serializers.CharField(validators=[phone_regex])

    class Meta:
        model = TeamMember
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'role']

    def validate_first_name(self, value):
        if not value:
            raise serializers.ValidationError("This field cannot be empty.")
        return value

    def validate_last_name(self, value):
        if not value:
            raise serializers.ValidationError("This field cannot be empty.")
        return value

    def validate_email(self, value):
        email = value.lower().strip()
        if not email:
            raise serializers.ValidationError("This field cannot be empty.")

        # Check if the email already exists in the database
        if TeamMember.objects.filter(email__iexact=email, is_deleted=False).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError("A team member with this email already exists.")

        return email
