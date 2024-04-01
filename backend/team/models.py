from django.db import models
from django.utils import timezone

class TeamMember(models.Model):
    ADMIN = 'admin'
    REGULAR = 'regular'
    ROLE_CHOICES = [
        (REGULAR, 'Regular - Can\'t delete members'),
        (ADMIN, 'Admin - Can delete members')
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    phone = models.CharField(max_length=15)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()