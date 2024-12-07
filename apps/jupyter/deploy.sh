#!/bin/bash

# Install wget
yum install wget -y

# Download and extract Micromamba
wget -qO- https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xvj bin/micromamba

# Export environment variables directly instead of using .bashrc
export PATH="$PWD/bin:$PATH"
export MAMBA_ROOT_PREFIX="$PWD/micromamba"

# Initialize Micromamba without modifying any shell profile files
./bin/micromamba shell init -s bash --no-modify-profile -p $MAMBA_ROOT_PREFIX

# Source Micromamba environment directly
eval "$(./bin/micromamba shell hook -s bash)"

# Activate the Micromamba environment
micromamba create -n jupyterenv python=3.11 -c conda-forge -y
micromamba activate jupyterenv

# Install the dependencies from requirements.txt
python -m pip install -r requirements.txt

# Build the JupyterLite site
jupyter lite --version
jupyter lite build --contents content --output-dir dist