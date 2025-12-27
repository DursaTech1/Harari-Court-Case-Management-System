# views.py
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ServiceRequest, ServiceDocument
from .serializers import ServiceRequestSerializer

class ServiceRequestView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # Extract files from request
        files = request.FILES.getlist('documents[]')  # Match React format
        
        # Prepare data dictionary
        service_data = {}
        
        # Copy all non-file fields to service_data
        for key, value in request.data.items():
            if key not in ['documents[]', 'documents']:
                service_data[key] = value
        
        # Create ServiceRequest
        service_request = ServiceRequest.objects.create(
            user=request.user,
            service_name=request.data.get('service_name', ''),
            data=service_data
        )
        
        # Create ServiceDocuments for each uploaded file
        for file in files:
            ServiceDocument.objects.create(
                service_request=service_request,
                file=file,
                document_type=request.data.get('document_type', 'general')
            )
        
        serializer = ServiceRequestSerializer(service_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)