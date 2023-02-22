const fs = require('fs');
const path = require('path');

const { getConfig } = require('../../server/config');

const fileMap = {};

const getFileUrl = ({ name, file }, prefix = '', parentFolder = 'public') => {
    const key = `${name}/${file}`;
    let fileUrl = fileMap[key];

    if (fileUrl) return fileUrl;

    const { rootDirectory } = getConfig();
    const moduleAssetFolder = path.join(rootDirectory, parentFolder, 'assets', name);
    if (!fs.existsSync(moduleAssetFolder)) return null;

    const directories = fs
        .readdirSync(moduleAssetFolder, { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .map((dir) => dir.name);

    let version = null;
    if (directories.length < 1) {
        return null;
    } else if (directories.length === 1) {
        [version] = directories;
    } else {
        // 如果存在多个版本选最新的
        version = directories.sort()[directories.length - 1];
    }

    fileUrl = fileMap[key] = fileUrl;

    return fileUrl;
};

module.exports = {
    getFileUrl
};
