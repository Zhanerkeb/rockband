import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Table, Divider, Button, Modal, Input, Form, message, Icon,  Upload} from 'antd';
import axios from "axios";
import {base_url, img_url} from "../config";
import Highlighter from "react-highlight-words";

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

function beforeUpload(file) {
    console.log(file.type);
    const isJPEG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';

    if (!(isPNG || isJPEG)) {
        message.error('You can only upload JPG, JPEG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return (isPNG || isJPEG ) && isLt2M;
};

class News extends Component {


    constructor(props) {
        super(props);
        this.state = {
            news: [],
            searchText: '',
            visible: false,
            imageUrl: null,
            loading: false,
            img:null,
            title: '',
            description: '',
            content: '',
            edittitle: '',
            editdescription: '',
            editimg:'',
            editid: '',
            editcontent: '',
            editvisible: false
        }
    }


    componentDidMount() {
        this.getData()
    }

    showModal = () => {
        this.setState({
            visible: true,

            imageUrl: null,
            title: '',
            description: '',
            content: '',

        });
    };

    getData = e => {
        axios.get(`${base_url}/news/get.php`).then(res => {
            this.setState({news: res.data});
        })
    };

    handleDelete = id => {
        axios.get(`${base_url}/news/delete.php?id=${id}`).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    };

    handleOk = e => {
        if (this.state.title.length > 0) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('title', this.state.title);
            fm.append('description', this.state.description);
            fm.append('content', this.state.content);

            axios.post(`${base_url}/news/save.php`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    visible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
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
        if (this.state.edittitle.length > 0) {
            let fm = new FormData();
            fm.append('id', this.state.editid);
            fm.append('img', this.state.img);
            fm.append('title', this.state.edittitle);
            fm.append('description', this.state.editdescription);
            fm.append('content', this.state.editcontent);

            axios.post(`${base_url}/news/update.php`, fm,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.setState({
                    editvisible: false,
                    img: null
                });
                this.getData();
            }).catch(err => {
                alert(err);
            })

        }
    };

    handleEditCancel = e => {
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
            editdescription: item.description,
            editcontent: item.content,
            imageUrl: img_url+'/'+item.imgsrc
        })
    }





    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                    this.setState({
                        imageUrl,
                        upload_img: info.file.originFileObj,
                        imageLoading: false,
                    });

                }
            );
        }
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ imageLoading: true });
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
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };


    render() {
        const data = this.state.news.map((item, i) => {
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible} = this.state;

        const uploadButton = (
            <div>
                <Icon type={this.state.imageLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;


        const columns = [
            {
                title: 'Картинка',
                key: 'imgsrc',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url+record.imgsrc} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Название',
                dataIndex: 'title',
                key: 'title',
                ...this.getColumnSearchProps('title'),

            },
            {
                title: 'Описание',
                dataIndex: 'description',
                key: 'description',
                ...this.getColumnSearchProps('description'),

            },
            {
                title: 'Содержание',
                dataIndex: 'content',
                key: 'content',
                ...this.getColumnSearchProps('content'),

            },
            {
                title: 'Действия',
                key: 'action',
                render: (text, record) => (
                    <span>
        <a href="javascript:;" onClick={() => this.openEditModal(record)}>Редактировать</a>
    <Divider type="vertical"/>
        <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>Удалить</a>
    </span>
                ),
            },
        ];
        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Добавить Новость</Button>
                <Modal
                    visible={visible}
                    title="Создать новость"
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
                            <Input placeholder="Введите название" onChange={this.onChange} name="title"
                                   value={this.state.title}/>
                        </Form.Item>

                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="description"
                                   value={this.state.description}/>
                        </Form.Item>
                        <Form.Item label="Содержание">
                            <Input placeholder="Введите содержание" onChange={this.onChange} name="content"
                                   value={this.state.content}/>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650">
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
                    title="Редактировать новость"
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
                            <Input placeholder="Введите название" onChange={this.onChange} name="edittitle"
                                   value={this.state.edittitle}/>
                        </Form.Item>

                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="editdescription"
                                   value={this.state.editdescription}/>
                        </Form.Item>
                        <Form.Item label="Содержание">
                            <Input placeholder="Введите содержание" onChange={this.onChange} name="editcontent"
                                   value={this.state.editcontent}/>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650">
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

                <Table columns={columns} dataSource={data}/>


            </div>
        )
    }
}

News.propTypes = {}
export default withRouter(News);