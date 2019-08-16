react-scripts build
cd app
if [ -e ./build ]; then
    rm -rf ./build
fi
../node_modules/typescript/bin/tsc --outDir ./build --esModuleInterop app.ts
cd ..
