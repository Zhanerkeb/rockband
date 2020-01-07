import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {base_url, img_url} from "../config";

import {Table, Divider, Button, Modal, Input, Form, Select, Upload, message, Icon} from 'antd';
import Highlighter from "react-highlight-words";

const {Option} = Select;


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


class Products extends Component {
    constructor(props) {
        super(props);


        this.state = {
            loading: false,
            imageUrl: null,
            products: [],
            visible: false,
            name: '',
            description: '',
            typeId: null,
            img: null,
            price: '',
            country: '',
            categories: [],
            life: '',
            weight: '',
            editid: '',
            editname: '',
            editdesription: '',
            editimg: '',
            editprice: '',
            editcountry: '',
            editvisible: false,
            editlife: '',
            editweight: ''
        }
    }


    componentDidMount() {
        this.getData();
        axios.get(`${base_url}/categories/get.php`).then(res => {
            this.setState({categories: res.data});
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
            imageUrl: null,
            typeId: null,
            name: '',
            description: '',
            img: null,
            price: '',
            country: '',
            life: '',
            weight: '',
        });
    };

    getData = e => {
        axios.get(`${base_url}/products/get.php`).then(res => {
            this.setState({products: res.data});
        })
    };

    handleDelete = id => {
        axios.get(`${base_url}/products/delete.php?id=${id}`).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    }

    handleOk = e => {

        if (this.state.name.length > 0) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.name);
            fm.append('description', this.state.description);
            fm.append('price', this.state.price);
            fm.append('country', this.state.country);
            fm.append('typeId', this.state.typeId);
            fm.append('life', this.state.life);
            fm.append('weight', this.state.weight);


            axios.post(`${base_url}/products/save.php`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.setState({
                    visible: false,
                    typeId: null,
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
        if (this.state.editname.length > 0) {
            let fm = new FormData();
            fm.append('id', this.state.editid);
            fm.append('img', this.state.img);
            fm.append('name', this.state.editname);
            fm.append('description', this.state.editdescription);
            fm.append('price', this.state.editprice);
            fm.append('country', this.state.editcountry);
            fm.append('typeId', this.state.typeId);
            fm.append('life', this.state.editlife);
            fm.append('weight', this.state.editweight);

            axios.post(`${base_url}/products/update.php`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.setState({
                    editvisible: false,
                    typeId: null,
                    img: null
                });
                this.getData();
            }).catch(err => {
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

    onChangeSelect = (value) => {
        this.setState({
            typeId: value
        });
    };


    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            editname: item.name,
            editdescription: item.description,
            editprice: item.price,
            editcountry: item.country,
            typeId: item.typeId,
            imageUrl: img_url + '/' + item.imgsrc,
            editlife: item.life,
            editweight: item.weight,

        })
        console.log(item);
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
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
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>
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
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({searchText: selectedKeys[0]});
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };


    render() {

        const data = this.state.products.map((item, i) => {
            return {
                ...item,
                key: i
            }
        });

        const {visible, loading, editvisible, categories} = this.state;


        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: 'Картинка',
                key: 'imgsrc',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url + '/' + record.imgsrc} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),

            },
            {
                title: 'Описание',
                dataIndex: 'description',
                key: 'description',
                ...this.getColumnSearchProps('description'),

            },
            {
                title: 'Цена',
                dataIndex: 'price',
                key: 'price',
                ...this.getColumnSearchProps('price'),

            },
            {
                title: 'Страна',
                dataIndex: 'country',
                key: 'country',
                ...this.getColumnSearchProps('country'),

            }, {
                title: 'Срок Хранения',
                dataIndex: 'life',
                key: 'life',
                ...this.getColumnSearchProps('life'),

            },
            {
                title: 'Вес',
                dataIndex: 'weight',
                key: 'weight',
                ...this.getColumnSearchProps('weight'),

            },
            {
                title: 'Категория',
                dataIndex: 'category',
                key: 'category',
                ...this.getColumnSearchProps('category'),

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

        let options;

        if (categories && categories.length > 0) {
            console.log(categories)
            options = categories.map((item, i) => (
                <Option value={item.id} key={i}>{item.type}</Option>
            ))
        }

        // uploadu image
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const {imageUrl} = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Добавить продукт</Button>
                <Modal
                    visible={visible}
                    title="Создать продукт"
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
                        <Form.Item label="Картинка Продукта Предпочитаемый Размер 450х250">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar"/> : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Название">
                            <Input placeholder="Введите название" onChange={this.onChange} name="name"
                                   value={this.state.name}/>
                        </Form.Item>
                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="description"
                                   value={this.state.description}/>
                        </Form.Item>
                        <Form.Item label="Цена">
                            <Input placeholder="Введите цену" onChange={this.onChange} name="price"
                                   value={this.state.price}/>
                        </Form.Item>
                        <Form.Item label="Страна">
                            <Input placeholder="Введите страну" onChange={this.onChange} name="country"
                                   value={this.state.country}/>
                        </Form.Item>
                        <Form.Item label="Вес">
                            <Input placeholder="Введите Вес" onChange={this.onChange} name="weight"
                                   value={this.state.weight}/>
                        </Form.Item>
                        <Form.Item label="Срок Хранения">
                            <Input placeholder="Введите срок хранения" onChange={this.onChange} name="life"
                                   value={this.state.life}/>
                        </Form.Item>
                        <Form.Item label="Категория">
                            <Select onChange={this.onChangeSelect} name="typeId" value={this.state.typeId}>
                                {options}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    visible={editvisible}
                    title="Редактировать продукт"
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
                        <Form.Item label="Картинка Продукта Предпочитаемый Размер 450х250">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={beforeUpload}
                                onChange={this.handleChange}
                            >
                                {imageUrl ? <img src={imageUrl} alt="avatar"/> : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Название">
                            <Input placeholder="Введите название" onChange={this.onChange} name="editname"
                                   value={this.state.editname}/>
                        </Form.Item>
                        <Form.Item label="Описание">
                            <Input placeholder="Введите описание" onChange={this.onChange} name="editdescription"
                                   value={this.state.editdescription}/>
                        </Form.Item>
                        <Form.Item label="Цена">
                            <Input placeholder="Введите цену" onChange={this.onChange} name="editprice"
                                   value={this.state.editprice}/>
                        </Form.Item>
                        <Form.Item label="Страна">
                            <Input placeholder="Введите страну" onChange={this.onChange} name="editcountry"
                                   value={this.state.editcountry}/>
                        </Form.Item>
                        <Form.Item label="Вес">
                            <Input placeholder="Введите Вес" onChange={this.onChange} name="editweight"
                                   value={this.state.editweight}/>
                        </Form.Item>
                        <Form.Item label="Срок Хранения">
                            <Input placeholder="Введите срок хранения" onChange={this.onChange} name="editlife"
                                   value={this.state.editlife}/>
                        </Form.Item>
                        <Form.Item label="Категория">
                            <Select onChange={this.onChangeSelect} name="typeId" value={this.state.typeId}>
                                {options}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Table columns={columns} dataSource={data}/>


            </div>
        )

    }
}

Products.propTypes = {}
export default withRouter(Products);