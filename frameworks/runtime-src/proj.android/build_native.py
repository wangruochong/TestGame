#!/usr/bin/python

import os
import shutil

def copy_resouces(project_root):
    print("Copying resources to assets...")
    src_dir = os.path.join(project_root, "../../../res")
    des_dir = os.path.join(project_root, "app/assets")
    if os.path.isdir(des_dir):
        shutil.rmtree(des_dir)
    
    des_dir = os.path.join(des_dir, "res")
    shutil.copytree(src_dir, des_dir)

def build_scripts():
    print("Building js scripts...")
    cur_dir = os.getcwd()
    root = os.path.join(project_root, "../../..")
    os.chdir(root)
    runCmd("browserify main.js > js/game.js")
    os.chdir(cur_dir)

def copy_scripts(project_root):
    print("Copying scripts to assets...")
    src_file = os.path.join(project_root, "../../../js/game.js")
    des_dir = os.path.join(project_root, "app/assets/js")
    if not os.path.exists(des_dir):
        os.makedirs(des_dir)
    
    des_file = os.path.join(des_dir, "game.js")
    shutil.copyfile(src_file, des_file)

def copy_manifests(project_root):
    print("Copying manifests to assets...")
    src_dir = os.path.join(project_root, "../../../manifests")
    des_dir = os.path.join(project_root, "app/assets/manifests")
    if not os.path.exists(des_dir):
        os.makedirs(des_dir)

    shutil.copyfile(os.path.join(src_dir, "project.manifest"), os.path.join(des_dir, "project.manifest"))
    shutil.copyfile(os.path.join(src_dir, "version.manifest"), os.path.join(des_dir, "version.manifest"))

def build_native(project_root):
    print("Building native code...")
    cocos_root = os.path.join(project_root, "../../cocos2d-x")
    print("Cocos root exists:", os.path.exists(cocos_root))
    ndk_module_path = '%s/..:%s:%s/external:%s/cocos' % (cocos_root, cocos_root, cocos_root, cocos_root)
    cmd = "ndk-build -j2 NDK_DEBUG=1 -C %s/app/jni NDK_MODULE_PATH=%s --debug" % (project_root, ndk_module_path)
    # cmd = "ndk-build -B NDK_DEBUG=1 -C %s/app/jni NDK_MODULE_PATH=%s" % (project_root, ndk_module_path)
    runCmd(cmd)

def build():
    print("Building apk...")
    cmd = "./gradlew --info assembleDebug"
    runCmd(cmd)

def runCmd(cmd):
    print("sh:%s" % cmd)
    os.system(cmd)

if __name__ == '__main__':
    project_root = os.path.dirname(os.path.realpath(__file__))
    print("Begin to build apk with project_root: %s" % project_root)
    copy_resouces(project_root)
    copy_manifests(project_root)
    build_scripts()
    copy_scripts(project_root)
    build_native(project_root)
    build()
    print("Successful;)")
    