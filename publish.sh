#!/bin/bash

# install the azure cli with this command:

# curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash



az webapp up --runtime "PHP:8.0" --os-type=linux --name "sfs-events"

