# coding=utf-8

# 此文档主要用于生成project.manifest文件，其中核心在于获取res和src目录下的所有文件的size和md5
import os,hashlib
import shutil
roots = ["res", "js"]

def genManifest(ignoreAssets):
    prefix = '''{
    "packageUrl" : "http://10.10.24.237:8000/package_res/",
    "remoteManifestUrl" : "http://10.10.24.237:8000/manifests/project.manifest",
    "remoteVersionUrl" : "http://10.10.24.237:8000/manifests/version.manifest",
    "version" : "1.0.0",
    "engineVersion" : "3.12",
'''
    
    if ignoreAssets:
        assets = ""
        manifestName = "version"
    else:
        assets = ''' 
    "assets" : {
'''
        manifestName = "project"
        metadatas = getFileMetadatas()
        for i in range(0, len(metadatas)):
            metaData = metadatas[i]
            assets += '\t\t\"' + metaData[0] + '\": {\n'
            assets += '\t\t\t '+ '"size": %d,\n' %metaData[1][0]
            assets += '\t\t\t '+ '"md5": "%s"\n' %metaData[1][1]
            dot = ',' if i < len(metadatas) - 1 else ''
            assets += '\t\t}%s\n' %dot

        assets = assets[0:-1]

    suffix = ""
    if not ignoreAssets:
        suffix += "},"

    suffix += '''
    "searchPaths" : [
    ]
}
    '''
    manifestText = prefix + assets + suffix

    try:
        manifestFile = open("manifests/{0}.manifest".format(manifestName), 'w')
        manifestFile.write(manifestText)
    except IOError:
        print "IO Error!"
    else:
        print "Generate manifest successfully!"

def getFileMetadatas():
    metadatas = []
    for root in roots:
        for dir, subDirs, files in os.walk(root):
            for file in files:
                filePath = dir + '/' + file
                if not os.path.isfile(filePath):
                    continue

                fileSize = os.path.getsize(filePath)
                fileMD5 = getFileMD5(filePath)
                metadatas.append((filePath, (fileSize, fileMD5)))

    return metadatas

def getFileMD5(filePath):
    try:
        f = open(filePath, 'r')
        md5Obj = hashlib.md5()
        md5Obj.update(f.read())
        hash = md5Obj.hexdigest()
        f.close()
    except:
        return None

    return str(hash).lower()

def copyDir(srcDir, dstDir):
    src = os.path.abspath(srcDir)
    dst = os.path.abspath("../../ota_server/{0}".format(dstDir))
    shutil.rmtree(dst)
    shutil.copytree(src, dst)


if __name__ == "__main__":
    # 生成version和project manifest文件
    genManifest(False)
    genManifest(True)

