#!/bin/bash

trap "kill 0" EXIT

echo "Avvio del Backend..."
cd "./backend" && npm run dev &

echo "Avvio del Frontend..."
cd "./frontend" && npm start &

wait
