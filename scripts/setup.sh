#!/bin/bash

# Resume Analyzer Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Resume Analyzer Setup Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        docker --version
    else
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        docker-compose --version
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success "Created backend .env file"
    else
        print_warning "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        print_success "Created frontend .env file"
    else
        print_warning "Frontend .env file already exists"
    fi
}

# Create necessary directories
setup_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads
    mkdir -p logs
    
    # Set proper permissions
    chmod 755 uploads
    chmod 755 logs
    
    print_success "Directories created successfully"
}

# Build and start services
build_services() {
    print_status "Building Docker services..."
    
    docker-compose build --no-cache
    print_success "Docker services built successfully"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    docker-compose up -d
    print_success "Services started successfully"
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_success "Backend API is healthy"
    else
        print_warning "Backend API health check failed"
    fi
    
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend health check failed"
    fi
}

# Main setup function
main() {
    echo
    print_status "Starting Resume Analyzer setup..."
    echo
    
    check_docker
    echo
    
    setup_environment
    echo
    
    setup_directories
    echo
    
    build_services
    echo
    
    start_services
    echo
    
    print_success "🎉 Resume Analyzer setup completed successfully!"
    echo
    echo "📋 Access Information:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo
    echo "🔧 Useful Commands:"
    echo "   docker-compose logs -f          # View logs"
    echo "   docker-compose down             # Stop services"
    echo "   docker-compose up --build       # Rebuild and start"
    echo "   docker-compose exec backend bash  # Access backend container"
    echo
    echo "📚 For more information, check the README.md file"
    echo
}

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    main
else
    print_error "This script is designed for macOS and Linux. For Windows, please use Docker Desktop and run the commands manually."
    exit 1
fi