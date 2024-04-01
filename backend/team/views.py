from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TeamMember
from .serializers import TeamMemberSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class TeamMemberAPIView(APIView):
    @swagger_auto_schema(
        operation_id='list_team_members',
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="A list of team members",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='Success flag'),  # Adjusted to TYPE_BOOLEAN for success flag
                        'data': openapi.Schema(
                            type=openapi.TYPE_ARRAY,  # Indicates that 'data' is an array
                            description="List of team members",  # Optional: add a description for clarity
                            items=openapi.Schema(  # Defines the structure of each item in the array
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'email': openapi.Schema(type=openapi.TYPE_STRING),
                                    'phone': openapi.Schema(type=openapi.TYPE_STRING),
                                    'role': openapi.Schema(type=openapi.TYPE_STRING),
                                },
                            )
                        )
                    }
                )
            )
        },
        manual_parameters=[
            openapi.Parameter('sort', openapi.IN_QUERY, description="Sort by 'name' or 'created_at'", type=openapi.TYPE_STRING)
        ]
    )
    def get(self, request):
        sort_param = request.query_params.get('sort', 'name')

        if sort_param == 'created_at':
            members = TeamMember.objects.filter(is_deleted=False).order_by('created_at')
        else:
            members = TeamMember.objects.filter(is_deleted=False).order_by('first_name', 'last_name')

        serializer = TeamMemberSerializer(members, many=True)
        return Response({"success": 1, "data": serializer.data})

    @swagger_auto_schema(
        operation_id='create_team_member',
        request_body=TeamMemberSerializer,  # Assuming this is your serializer for creating/updating team members
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="Team member created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Success indicator'),
                        'data': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            description="Created team member details",
                            properties={  # You should adjust these properties based on the fields in your serializer
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'phone': openapi.Schema(type=openapi.TYPE_STRING),
                                'role': openapi.Schema(type=openapi.TYPE_STRING),
                            },
                        ),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Indicates failure'),
                        'errors': openapi.Schema(type=openapi.TYPE_OBJECT, description='Error details'),
                    }
                )
            ),
        }
    )
    def post(self, request):
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": 1, "data": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"success": 0, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class TeamMemberDetailAPIView(APIView):
    @swagger_auto_schema(
        operation_id='fetch_team_member',
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="A single team member",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Success indicator'),
                        'data': openapi.Schema(
                            title="TeamMember",
                            type=openapi.TYPE_OBJECT,
                            properties={  
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'phone': openapi.Schema(type=openapi.TYPE_STRING),
                                'role': openapi.Schema(type=openapi.TYPE_STRING)
                            },
                        )
                    }
                )
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(description="Team member not found")
        }
    )
    def get(self, request, pk):
        member = get_object_or_404(TeamMember, pk=pk, is_deleted=False)
        serializer = TeamMemberSerializer(member)
        return Response({"success": 1, "data": serializer.data})
    
    @swagger_auto_schema(
        operation_id='update_team_member',
        request_body=TeamMemberSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Team member updated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Success indicator'),
                        'data': openapi.Schema(
                            title="TeamMember",
                            type=openapi.TYPE_OBJECT,
                            properties={  
                                'id': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'first_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'last_name': openapi.Schema(type=openapi.TYPE_STRING),
                                'email': openapi.Schema(type=openapi.TYPE_STRING),
                                'phone': openapi.Schema(type=openapi.TYPE_STRING),
                                'role': openapi.Schema(type=openapi.TYPE_STRING)
                            },
                        )
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid request data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Failure indicator'),
                        'errors': openapi.Schema(type=openapi.TYPE_OBJECT, description='Error details'),
                    }
                )
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(description="Team member not found")
        }
    )
    def put(self, request, pk):
        member = get_object_or_404(TeamMember, pk=pk, is_deleted=False)
        serializer = TeamMemberSerializer(member, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": 1, "data": serializer.data})
        else:
            return Response({"success": 0, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_id='delete_team_member',
        responses={
            status.HTTP_204_NO_CONTENT: openapi.Response(description="Team member deleted successfully"),
            status.HTTP_404_NOT_FOUND: openapi.Response(description="Team member not found")
        }
    )
    def delete(self, request, pk):
        member = get_object_or_404(TeamMember, pk=pk)
        member.is_deleted = True
        member.deleted_at = timezone.now()
        member.save()
        return Response({"success": 1}, status=status.HTTP_204_NO_CONTENT)