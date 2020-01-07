import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {base_url, img_url} from "../config";

import {  Button, Input, Form, Upload, message, Icon } from 'antd';


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


class MainPage extends Component {



    constructor(props){
        super(props);
        this.state = {
            id: null,
            utp: '',
            imageUrlOne: null,
            utp_bg_one: null,
            utp_info_one: null,
            imageUrlTwo: null,
            utp_bg_two: null,
            utp_info_two: null,
            imageUrlThree: null,
            utp_bg_three: null,
            utp_info_three: null,
            subtitle: '',
            about_title: '',
            num_one: '',
            num_text_one: '',
            num_two: '',
            num_text_two: '',
            num_three: '',
            num_text_three: '',
            mission_desc: '',
            about_production: '',
            sotr_text: '',
            footer_text: ''
        }
    }
    componentDidMount(){
        axios.get(`${base_url}/mainpage/get.php`)
            .then(res => {
                this.setState({
                    ...res.data,
                    imageUrlOne: img_url + '/' +res.data.utp_bg_one,
                    imageUrlTwo: img_url + '/' +res.data.utp_bg_two,
                    imageUrlThree: img_url + '/' +res.data.utp_bg_three
                })
            })
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleOk = e => {
        let fm = new FormData();
        fm.append('id', this.state.id);
        fm.append('utp', this.state.utp);
        fm.append('utp_bg_one', this.state.utp_bg_one);
        fm.append('utp_info_one', this.state.utp_info_one);
        fm.append('utp_bg_two', this.state.utp_bg_two);
        fm.append('utp_info_two', this.state.utp_info_two);
        fm.append('utp_bg_three', this.state.utp_bg_three);
        fm.append('utp_info_three', this.state.utp_info_three);
        fm.append('subtitle', this.state.subtitle);
        fm.append('about_title', this.state.about_title);
        fm.append('num_one', this.state.num_one);
        fm.append('num_text_one', this.state.num_text_one);
        fm.append('num_two', this.state.num_two);
        fm.append('num_text_two', this.state.num_text_two);
        fm.append('num_three', this.state.num_three);
        fm.append('num_text_three', this.state.num_text_three);
        fm.append('mission_desc', this.state.mission_desc);
        fm.append('about_production', this.state.about_production);
        fm.append('sotr_text', this.state.sotr_text);
        fm.append('footer_text', this.state.footer_text);

        axios.post(`${base_url}/mainpage/update.php`, fm, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                alert("Успешно сохраненно")
                this.setState({
                    utp_bg_one:null,
                    utp_bg_two:null,
                    utp_bg_three: null
                })
            }).catch(err=> {
                alert("Произошла ошибка при сохранений, скорее всего проблемма в картинках.")
        })
    }

    handleChangeOne = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrlOne =>
                this.setState({
                    imageUrlOne,
                    loading: false,
                    utp_bg_one: info.file.originFileObj
                }),
            );
        }
    };

    handleChangeTwo = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrlTwo =>
                this.setState({
                    imageUrlTwo,
                    loading: false,
                    utp_bg_two: info.file.originFileObj
                }),
            );
        }
    };

    handleChangeThree = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrlThree =>
                this.setState({
                    imageUrlThree,
                    loading: false,
                    utp_bg_three: info.file.originFileObj
                }),
            );
        }
    };

    render (){

        // uploadu image
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrlOne, imageUrlTwo, imageUrlThree } = this.state;

        return(
            <div>
                <Form layout={'vertical'}>
                    <Form.Item label="Утп">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="utp" value={this.state.utp}/>
                    </Form.Item>
                    <Form.Item label="Первый слайд Предпочитаемый Размер 1440х560">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeOne}
                        >
                            {imageUrlOne ? <img src={imageUrlOne} alt="avatar" /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Первый слайд текст">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="utp_info_one" value={this.state.utp_info_one}/>
                    </Form.Item>
                    <Form.Item label="Второй слайд Предпочитаемый Размер 1440х560">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeTwo}
                        >
                            {imageUrlTwo ? <img src={imageUrlTwo} alt="avatar" /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Второй слайд текст">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="utp_info_two" value={this.state.utp_info_two}/>
                    </Form.Item>
                    <Form.Item label="Третий слайд Предпочитаемый Размер 1440х560">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeThree}
                        >
                            {imageUrlThree ? <img src={imageUrlThree} alt="avatar" /> : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Третий слайд текст">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="utp_info_three" value={this.state.utp_info_three}/>
                    </Form.Item>
                    <Form.Item label="Мередиан это ">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="subtitle" value={this.state.subtitle}/>
                    </Form.Item>
                    <Form.Item label="Описание над цифрами">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="about_title" value={this.state.about_title}/>
                    </Form.Item>


                    <Form.Item label="Первая цифра">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_one" value={this.state.num_one}/>
                    </Form.Item>
                    <Form.Item label="Текст под первая цифрой">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_text_one" value={this.state.num_text_one}/>
                    </Form.Item>

                    <Form.Item label="Вторая цифра">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_two" value={this.state.num_two}/>
                    </Form.Item>
                    <Form.Item label="Текст под второй цифрой">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_text_two" value={this.state.num_text_two}/>
                    </Form.Item>

                    <Form.Item label="Третья цифра">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_three" value={this.state.num_three}/>
                    </Form.Item>
                    <Form.Item label="Текст под третьей цифрой">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="num_text_three" value={this.state.num_text_three}/>
                    </Form.Item>

                    <Form.Item label="Текст миссии">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="mission_desc" value={this.state.mission_desc}/>
                    </Form.Item>

                    <Form.Item label="Текст о нашей продукции">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="about_production" value={this.state.about_production}/>
                    </Form.Item>


                    <Form.Item label="Текст о сотрудничестве">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="sotr_text" value={this.state.sotr_text}/>
                    </Form.Item>


                    <Form.Item label="Текст в подвале">
                        <Input placeholder="Введите описание" onChange={this.onChange} name="footer_text" value={this.state.footer_text}/>
                    </Form.Item>

                    <Form.Item>
                        <Button key="submit" type="primary"  onClick={this.handleOk}>
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )

    }
}
MainPage.propTypes = {
}
export default withRouter(MainPage);