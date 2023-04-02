# coding=utf-8

# 此文档主要用于生成project.manifest文件，其中核心在于获取res和src目录下的所有文件的size和md5
import os,hashlib
roots = ["res", "src"]

def genManifest():
    prefix = '''{
    "packageUrl" : "http://192.168.0.105:8080/res/",
    "remoteManifestUrl" : "http://192.168.0.105:8080/res/project.manifest",
    "remoteVersionUrl" : "http://192.168.0.105:8080/res/version.manifest",
    "version" : "1.0.0",
    "engineVersion" : "3.12",
    
    "assets" : {
'''
    suffix = '''
    },

    "searchPaths" : [
    ]
}
    '''
    metadatas = getFileMetadatas()
    assets = ""
    for i in range(0, len(metadatas)):
        metaData = metadatas[i]
        assets += '\t\t\"' + metaData[0] + '\": {\n'
        assets += '\t\t\t '+ '"size": %d,\n' %metaData[1][0]
        assets += '\t\t\t '+ '"md5": "%s"\n' %metaData[1][1]
        dot = ',' if i < len(metadatas) - 1 else ''
        assets += '\t\t}%s\n' %dot

    assets = assets[0:-1]
    manifestText = prefix + assets + suffix

    try:
        manifestFile = open("project_bak.manifest", 'w')
        manifestFile.write(manifestText)
    except IOException:
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

if __name__ == "__main__":
    genManifest()
