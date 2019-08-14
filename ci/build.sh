if [ ! -e data ]; then
    mkdir data
    mkdir data/indices
    mkdir data/regions
fi
react-scripts build
cd app
../node_modules/typescript/bin/tsc --outDir ./build --esModuleInterop app.ts
cd ..
