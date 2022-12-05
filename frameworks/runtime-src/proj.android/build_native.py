#!/usr/bin/python

import os
import shutil


def copy_resouces(project_root):
    print("Copying resources to assets...")
    src_dir = os.path.join(project_root, "../../../res")
    des_dir = os.path.join(project_root, "app/assets")
    if os.path.isdir(des_dir):
        shutil.rmtree(des_dir)
    
    shutil.copytree(src_dir, des_dir)

def copy_scripts(project_root):
    print("Copying scripts to assets...")
    src_dir = os.path.join(project_root, "../../../js")
    des_dir = os.path.join(project_root, "app/js")
    if os.path.isdir(des_dir):
        shutil.rmtree(des_dir)

    shutil.copytree(src_dir, des_dir)

def build_native(project_root):
    print("Building native code...")
    cocos_root = os.path.join(project_root, "../cocos2d")
    ndk_module_path = '%s/..:%s:%s/external:%s/cocos' % (cocos_root, cocos_root, cocos_root, cocos_root)
    cmd = "ndk-build -j2 NDK_DEBUG=1 -C %s/app/jni NDK_MODULE_PATH=%s" % (project_root, ndk_module_path)
    # cmd = "ndk-build -B NDK_DEBUG=1 -C %s/app/jni NDK_MODULE_PATH=%s" % (project_root, ndk_module_path)
    os.system(cmd)

def build():
    print("Building apk...")
    cmd = "./gradlew --info assembleDebug"
    os.system(cmd)

if __name__ == '__main__':
    project_root = os.path.dirname(os.path.realpath(__file__))
    copy_resouces(project_root)
    copy_scripts(project_root)
    build_native(project_root)
    build()
    print("Successful;)")
    