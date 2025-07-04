#!/bin/bash
cd /home/kavia/workspace/code-generation/taskmaster-web-66464-7dbee949/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

