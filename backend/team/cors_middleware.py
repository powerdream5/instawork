from django.http import HttpResponse

class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If it's a preflight request
        if request.method == "OPTIONS":
            response = HttpResponse()
            response["Content-Type"] = "application/json"
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "POST, PUT, DELETE,GET, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type"
        else:
            response = self.get_response(request)
            response["Access-Control-Allow-Origin"] = "*"

        return response
