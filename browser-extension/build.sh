rm -rf build
rm chrome.zip
mkdir build
cp * build/
cd build
zip -r ../chrome.zip .
cd ..
