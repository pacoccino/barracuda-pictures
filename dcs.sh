#!/bin/bash
# generate a random password

function environments {
        if [[ ${ENVIRONMENT} == 'dev' ]];then
           DC_FILES+=' -f docker-compose.dev.yml --env-file .env'
        fi
        if [[ ${ENVIRONMENT} == 'prod' ]];then
           DC_FILES+=' -f docker-compose.prod.yml --env-file .env.prod'
        fi
        if [[ ${TASK} ]];then
           DC_FILES+=' -f docker-compose.tasks.yml'
        fi
}

function usage {
        echo "Usage: $(basename $0) -e LENGTH [-t] COMMAND" 2>&1
        echo 'Use docker-compose with files.'
        echo '   -e environment   Specify the environment (dev, prod)'
        echo '   -t               With task'
        echo '   COMMAND          rest of docker compose commandk'
        exit 1
}

# Set default password length
ENVIRONMENT=dev

# if no input argument found, exit the script with usage
if [[ ${#} -eq 0 ]]; then
   usage
fi

# Define list of arguments expected in the input
optstring=":te:"

while getopts ${optstring} arg; do
  case ${arg} in
    t)
      TASK='true'
      ;;
    e)
      if [[ ${OPTARG} != 'dev' && ${OPTARG} != 'prod' ]]; then
         echo "Invalid environment"
         echo
         usage
         exit 1
      fi
      ENVIRONMENT="${OPTARG}"
      ;;
    ?)
      echo "Invalid option: -${OPTARG}."
      echo
      usage
      ;;
  esac
done

REST_ARGS="${@:$OPTIND}"

DC_FILES='-f docker-compose.yml'

environments

COMMAND="docker-compose $DC_FILES $REST_ARGS"

echo ":: Docker-compose utility ::"
echo "Running command:"
echo "$COMMAND"

eval $COMMAND

exit 0
