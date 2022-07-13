const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

//joining path of directory
const assetsPath = path.join(__dirname, "../");
const srcPath = path.join(__dirname, "../assets/ktxTest/src");
const destPath = path.join(__dirname, "../assets/ktxTest/ktx");

const { readdir, stat } = require("fs/promises");

const dirSize = async (directory) => {
    const files = await readdir(directory);
    const stats = files.map((file) => stat(path.join(directory, file)));

    return (await Promise.all(stats)).reduce(
        (accumulator, { size }) => accumulator + size,
        0
    );
};

//passsing directoryPath and callback function
fs.readdir(srcPath, function (err, files) {
    const filesString = files
        .map((filename) => path.join(srcPath, filename))
        .join(" ");

    const resultJSON = {};
    resultJSON.pngs = files.map((filename) => ({
        id: filename.split(".")[0],
        url: path.relative(assetsPath, path.join(srcPath, filename)),
    }));

    resultJSON.ktx = files.map((filename) => ({
        id: filename.split(".")[0],
        url: path.relative(
            assetsPath,
            path.join(destPath, filename.split(".")[0] + ".ktx2")
        ),
    }));
    //
    exec(
        // best quality for ETC1S compression
        // `basisu -ktx2 -linear -max_endpoints 16128 -max_selectors 16128 -output_path ${destPath} ${filesString}`,

        // UASTC tests
        `basisu -ktx2 -linear -uastc -uastc_level 1 -uastc_rdo_l 1.5 -output_path ${destPath} ${filesString}`,
        async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);

            const srcSize = await dirSize(srcPath);
            const destSize = await dirSize(destPath);

            const percent = (100 - (destSize / srcSize) * 100).toFixed(3);

            console.log(`SOURCE DIR SIZE: ${srcSize}`);
            console.log(`COMPRE DIR SIZE: ${destSize}, shavedOff: ${percent}%`);
            console.log("RESULT JSON: ", JSON.stringify(resultJSON));
        }
    );
});
