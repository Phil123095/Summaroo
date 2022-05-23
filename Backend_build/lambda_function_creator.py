import subprocess


def create_and_push_ECR(module_name):
    ecr_address = "355622878315.dkr.ecr.eu-central-1.amazonaws.com"
    login_docker_aws = subprocess.run(["docker", "login", "-u", "AWS",
                                       "-p", "$(aws ecr get-login-password --region eu-central-1)", ecr_address])
    create_ecr_repo = subprocess.run(["aws", "ecr", "create-repository", "--repository-name", module_name])

    build_docker = subprocess.run(["docker", "compose", "build", module_name])
    docker_tag = subprocess.run(["docker", "tag", module_name + ":latest", ecr_address + "/" + module_name])
    docker_push_ecr = subprocess.run(["docker", "push", ecr_address + "/" + module_name + ":latest"])

    print(f"Login-Docker: {login_docker_aws}")
    print("-------------------------------------------------------------------------------------\n")
    print(f"ECR-Repo-Create: {create_ecr_repo}")
    print("-------------------------------------------------------------------------------------\n")
    print(f"Docker Build: {build_docker}")
    print("-------------------------------------------------------------------------------------\n")
    print(f"Docker ECR Push: {docker_push_ecr}")

    return


if __name__ == "__main__":
    create_and_push_ECR(module_name="module-tesing")