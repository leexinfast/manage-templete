import React, { useState, useEffect } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { Upload, Modal, message, Image } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import { uploadImage } from '@/services/commonUpload';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function BeforeUpload(file, callback, maxSize, errorMessage) {
    let check =( (file.size / 1024 ) - maxSize ) < 0;
    if(!check) {
        message.error(`图片最大不能超过${errorMessage}，请重新上传`)
    }
    if(callback) check = callback?.();
    return check ? check : Upload.LIST_IGNORE;
}

function UploadChange(fileObj, callback, path, props) {
    const { fileList=[], file={} } = fileObj;
    const { uid, status, originFileObj } = file;
    if (status === "uploading" || !status) {
        const formData = new FormData();
        formData.append('file', originFileObj||file);

        uploadImage(formData).then(res => {
            const result = fileList.map((item) => {
                if (item.uid === uid) {
                    item.url = res.success ? res.data?.url : '';
                    item.status = res.success ? 'done' : 'error'
                }
                return item
            })
            callback?.(result, props)
        })
    }

    if (status === 'removed') {
        callback?.(fileList, props)
    }
}

const CommonUpload = (props) => {
    const { maxCount=1, listType='picture-card', onChange, fileList, path='images', maxSize=2048, errorMessage='2M', checkParam, uploadProps, preImage, type } = props;
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
 
    const uploadButton = (
        //自定义预览
        preImage&&preImage.length>=maxCount ? <>
            {preImage.map((item, index)=> {
                return  <div key={index} style={{position: 'relative', border: item.status==='error' ? '1px solid #FF4D4F' : 'none'}}>
                            <Image src={item.url} width={80} />
                            {type!=="VIEW" && <span 
                                style={{ display: 'inline-block', position: 'absolute', top: 0, right: 0, width: 15, lineHeight: '15px', background: '#f5f5f5', cursor: 'pointer', opacity: 0.5 }}
                                onClick={()=> props.onChange([], props)}
                            >x</span>}
                        </div>
            })}
        </> : 
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    )

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    return (
        <>
            <Upload
                //action={`${API_URL}/fileUpload/upload`}
                customRequest={()=>{}}
                listType={listType}
                fileList={Array.isArray(fileList) ? fileList : []}
                beforeUpload ={file=> BeforeUpload(file, checkParam, maxSize, errorMessage)} 
                onPreview={handlePreview}
                onChange={fileObj=> UploadChange(fileObj, onChange, path, props)}
                disabled={preImage&&preImage.length>=maxCount} //自定义预览
                {...uploadProps}
            >
               {fileList && fileList.length >= maxCount ? null : uploadButton }
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

const FormUpload = (props)=> {

    const token = JSON.parse(localStorage.getItem('token')||'{}');
    const { proFormUpload={}, getFileList, fileList=[], maxSize=2048, errorMessage='2M', checkParam } = props;
    const [urlList, setUrlList] = useState(fileList);
    useEffect(() => {
       setUrlList(fileList);
    }, [fileList])

    const beforeUpload = (file, fileList)=> {
        let check =( (file.size / 1024 ) - maxSize ) < 0;
        if(!check) {
            message.error(`图片最大不能超过${errorMessage}，请重新上传`)
        }
        if(checkParam) check = checkParam?.();
        return check ? check : Upload.LIST_IGNORE;
    }

    return (
        <ProFormUploadButton
            name="mainImage"
            label="图片"
            action={`${API_URL}/fileUpload/upload`}
            rules={[{ required: true, message: '商品主图为必传项' }]}
            onChange ={file=> {
                let { fileList=[] } = file; 
                fileList = fileList.map(item=> {
                    const obj = {...item};
                    if(item.response) {
                        obj.thumbUrl = item.response.data?.url;
                        obj.url = item.response.data?.url;
                    }
                    return obj
                })
                setUrlList(fileList);
                getFileList?.(fileList);
            }} 
            fileList={urlList}
            { ...proFormUpload}
            fieldProps={{
                name: 'file',
                listType: 'picture-card',
                accept: "image/*",
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
                beforeUpload: beforeUpload,
                ...proFormUpload?.fieldProps
            }}
        />
    )
}

export  {
    BeforeUpload,
    UploadChange,
    CommonUpload,
    FormUpload
}