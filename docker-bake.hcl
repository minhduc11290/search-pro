group "default" {
  targets = ["builder", "api", "web"]
}

target "builder" {
  dockerfile = "docker/Dockerfile.build"
  tags = ["cfm/builder:latest"]
}

target "api" {
  dockerfile = "docker/Dockerfile.api"
  contexts = {
    builder = "target:builder"
  }
  tags = ["cfm/api:latest"]
}

target "web" {
  dockerfile = "docker/Dockerfile.web"
  contexts = {
    builder = "target:builder"
  }
  tags = ["cfm/web:latest"]
}