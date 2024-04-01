from drf_yasg import openapi

# Custom response schema for a list of items
custom_response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Success flag'),
        'data': openapi.Schema(
            type=openapi.TYPE_ARRAY, 
            items=openapi.Items(ref='#/definitions/TeamMemberSerializer'),
            description='Array of team members'
        )
    }
)

# Custom response schema for a single item
custom_response_single_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'success': openapi.Schema(type=openapi.TYPE_INTEGER, description='Success flag'),
        'data': openapi.Schema(
            ref='#/definitions/TeamMemberSerializer',
            description='Single team member'
        )
    }
)
