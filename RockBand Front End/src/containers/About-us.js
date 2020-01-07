import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {base_url,img_url} from "../config";
import {Table, Divider, Button, Modal, Input, Form, Upload, message, Icon} from 'antd';


function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isJPEG = file.type === 'image/jpeg';

    if (!isJPG && !isPNG && !isJPEG) {
        message.error('Загружайте только JPG, PNG, JPEG файлы!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Размер файла не должен привышать 2MB!');
    }
    return (isJPG || isJPEG || isPNG) && isLt2M;
}

class AboutUs extends Component {
    constructor(props){
        super(props);


        this.state = {
            aboutus: [],
            visible: false,
            imageUrl: null,
            loading: false,
            img:null,
            title: '',
            description: '',
            edittitle: '',
            editdescripiton: '',
            editid: '',
            editvisible: false
        }
    }
    componentDidMount(){
        this.getData()
    }

    showModal = () => {
        this.setState({
            visible: true,
            imageUrl: null,
            title: '',
            description: ''

        });
    };

    getData = e => {
        axios.get(`${base_url}/aboutus/get.php`).then(res=> {
            this.setState({aboutus: res.data });
        })
    }

    handleDelete = id => {
        axios.get(`${base_url}/aboutus/delete.php?id=${id}`).then(res=>{
            this.getData();
        }).catch(err=>{
            alert(err);
        })
    }

    handleOk = e => {

        if(this.state.title.length > 0) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('title', this.state.title);
            fm.append('description', this.state.description);

            axios.post(`${base_url}/aboutus/save.php`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res=>{
                this.setState({
                    visible: false,
                    img: null
                });
                this.getData();
            }).catch(err=>{
                alert(err);
            })

        }
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    handleEditOk = e => {
        console.log(this.state)
        if(this.state.edittitle.length > 0) {
            let fm = new FormData();
            fm.append('id', this.state.editid);
            fm.append('img', this.state.img);
            fm.append('title', this.state.edittitle);
            fm.append('description', this.state.editdescripiton);

            axios.post(`${base_url}/aboutus/update.php`,  fm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res=>{
                this.setState({
                    editvisible: false,
                    img: null
                });
                this.getData();
            }).catch(err=>{
                alert(err);
            })

        }
    };

    handleEditCancel = e => {
        console.log(e);
        this.setState({
            editvisible: false,
        });
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            edittitle: item.title,
            editdescripiton: item.description,
            imageUrl: img_url+'/'+item.image
        })
        console.log(item);
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                    img: info.file.originFileObj
                }),
            );
        }
    };


    render (){

        const data = this.state.aboutus.map((item, i)=>{
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible } = this.state;



        const columns = [

            {
                title: 'Картинка',
                key: 'image',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url+'/'+record.image} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Название',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: 'Описание',
                dataIndex: 'description',
                key: 'description'
            },

            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
              <a href="javascript:;" onClick={()=>this.openEditModal(record)}>Редактировать</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={()=>this.handleDelete(record.id)}>Удалить</a>
            </span>
                ),
            },
        ];
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return(
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Написать что-то о Нас</Button>
                <Modal
                    visible={visible}
                    title="Написать что-то о Нас"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            Сохранить
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Название">
                            <Input placeholder="Введите название" onChange={this.onChange} name="title" value={this.state.title}/>
                        </Form.Item>
                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="description" value={this.state.description}/>
                        </Form.Item>
                        <Form.Item label="Картинка Страницы о Нас Предпочитаемый Размер 400х510
">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Редактировать Статью о Нас"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            Отменить
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEditOk}>
                            Сохранить
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>

                        <Form.Item label="Название">
                            <Input placeholder="Введите название" onChange={this.onChange} name="edittitle" value={this.state.edittitle}/>
                        </Form.Item>
                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="editdescripiton" value={this.state.editdescripiton}/>
                        </Form.Item>
                        <Form.Item label="Картинка Страницы о Нас Предпочитаемый Размер 400х510
">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data} />


            </div>
        )

    }
}
AboutUs.propTypes = {
}
export default withRouter(AboutUs);