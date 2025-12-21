from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ServiceRequest, ServiceDocument

class SubmitServiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        service = ServiceRequest.objects.create(
            user=request.user,
            service_name=request.data.get("service_name"),
            data=request.data.dict()
        )

        for file in request.FILES.values():
            ServiceDocument.objects.create(service=service, file=file)

        return Response({"message": "Service submitted"})
