# coding=utf-8

# 此文档主要用于生成project.manifest文件，其中核心在于获取res和src目录下的所有文件的size和md5
import os
import shutil

def copyDir(srcDir, dstDir):
    curDir = os.path.abspath(srcDir)
    remoteDir = getRemoteDir(dstDir)
    for root,dirs,files in os.walk(srcDir):
        rootDir = os.path.abspath(root)
        relDir = os.path.relpath(rootDir, curDir)
        for f in files:
            srcFile = os.path.join(rootDir, f)
            dstFile = os.path.join(remoteDir, os.path.relpath(srcFile, srcDir))
            dstDir = os.path.dirname(dstFile)
            if not os.path.exists(dstDir):
                os.makedirs(dstDir)

            print "copying from %s to %s" % (srcFile, dstFile)
            shutil.copy2(srcFile, dstFile)

def uploadPackageRes():
    for dir in ["js", "res", "manifests"]:
        copyDir(dir, "package_res")

def uploadManifests():
    copyDir("manifests", "manifests")

def getRemoteDir(dir):
    return os.path.abspath("../../ota_server/{0}".format(dir))

if __name__ == "__main__":
   os.system("python gen_manifest.py")
   uploadPackageRes()
   uploadManifests()