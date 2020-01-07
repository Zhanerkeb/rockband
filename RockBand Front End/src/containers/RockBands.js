import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Table, Divider, Button, Modal, Input, Form, message, Icon, Upload, InputNumber, Select} from 'antd';
import MaskedInput from 'antd-mask-input'
import axios from "axios";
import {base_url, img_url} from "../config";
import Highlighter from 'react-highlight-words';
const {Option} = Select;


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

class Articles extends Component {


    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            countries: [],
            musical_directions: [],

            visible: false,
            imageUrl: null,
            loading: false,
            img: null,
            searchText: '',
            filteredInfo: null,
            sortedInfo: null,
            name: '',
            year_founded: '',
            year_of_decay: '',
            rate: '',
            country_id: '',
            musical_direction_id: '',

            edit_name: '',
            edit_year_founded: '',
            edit_year_of_decay: '',
            edit_rate: '',
            edit_country_id: '',
            edit_musical_direction_id: '',

            editimg:'',
            editid: '',
            editvisible: false
        }
    }


    componentDidMount() {
        this.getData();
        this.getAddData();
    }

    showModal = () => {
        this.setState({
            visible: true,

            imageUrl: null,
            name: '',
            year_founded: '',
            year_of_decay: '',
            rate: '',
            country_id: '',
            musical_direction_id: '',

        });
    };

    getData = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/rock-bands/with-country-and-musical-direction`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            console.log(res.data);
            this.setState({articles: res.data});
        })
    };

    getAddData = e => {
        let token = JSON.parse(localStorage.getItem('token'));
        axios.get(`${base_url}/countries`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            console.log(res.data);
            this.setState({countries: res.data});
        });

        axios.get(`${base_url}/musical-directions`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            console.log(res.data);
            this.setState({musical_directions: res.data});
        })
    };

    handleDelete = id => {
        let token = JSON.parse(localStorage.getItem('token'));

        axios.delete(`${base_url}/rock-bands/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            this.getData();
        }).catch(err => {
            alert(err);
        })
    };

    handleOk = e => {
        let token = JSON.parse(localStorage.getItem('token'));

        if (this.state.name.length > 0) {

            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.name);
            fm.append('year_founded', this.state.year_founded);
            fm.append('year_of_decay', this.state.year_of_decay?this.state.year_of_decay:null);
            fm.append('rate', this.state.rate);
            fm.append('country_id', this.state.country_id);
            fm.append('musical_direction_id', this.state.musical_direction_id);

            axios.post(`${base_url}/rock-bands`, fm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
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
        let token = JSON.parse(localStorage.getItem('token'));

        console.log(this.state);

        if (this.state.edit_name.length > 0) {
            let fm = new FormData();
            fm.append('img', this.state.img);
            fm.append('name', this.state.edit_name);
            fm.append('year_founded', this.state.edit_year_founded);
            fm.append('year_of_decay', this.state.edit_year_of_decay?this.state.edit_year_of_decay:null);
            fm.append('rate', this.state.edit_rate);
            fm.append('country_id', this.state.edit_country_id);
            fm.append('musical_direction_id', this.state.edit_musical_direction_id);


            axios.put(`${base_url}/rock-bands/${this.state.editid}`, fm,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization" : `Bearer ${token}`
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
    };

    onNumberChange = name => value => {
        this.setState({
            [name]: value
        });
    };

    onChangeSelectCountry = (value) => {
        this.setState({
            country_id: value
        });
    };

    onChangeSelectCountryUpdate = (value) => {
        this.setState({
            edit_country_id: value
        });
    };

    onChangeSelectMusical_direction = (value) => {
        this.setState({
            musical_direction_id: value
        });
    };

    onChangeSelectMusical_directionUpdate = (value) => {
        this.setState({
            edit_musical_direction_id: value
        });
    };

    openEditModal = item => {
        this.setState({
            editvisible: true,
            editid: item.id,
            edit_name: item.name,
            edit_year_founded: item.year_founded,
            edit_year_of_decay: item.year_of_decay,
            edit_rate: item.rate,
            edit_country_id: item.country_id,
            edit_musical_direction_id: item.musical_direction_id,
            imageUrl: img_url+'/'+item.image
        });
        console.log(item);
    };





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

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
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
                textToHighlight={text?text.toString():'-'}
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
        const {visible, loading, editvisible, countries, musical_directions} = this.state;

        console.log({musical_directions});

        const data = this.state.articles.map((item, i) => {
            console.log({dirId: item.musical_direction_id});
            return {
                ...item,
                country: item.Country ? item.Country.name:'',
                musical_direction: item.Musical_direction ? item.Musical_direction.name:'',
                // country: countries && item.country_id !== 'null'?countries.filter(country => country.id === item.country_id)[0].name:'',
                // musical_direction: musical_directions && item.musical_direction_id !== 'null'?musical_directions.filter(direction => direction.id === item.musical_direction_id)[0].name:'',
                key: i
            }
        });


        const uploadButton = (
            <div>
                <Icon type={this.state.imageLoading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;


        const columns = [
            {
                title: 'ID',
                key: 'id',
                dataIndex: 'id',
            },
            {
                title: 'Image',
                key: 'image',
                render: (text, record) => (
                    <span>
                      <img width="50px" src={img_url+record.image} alt={record.name}/>
                    </span>
                ),
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Year Founded',
                dataIndex: 'year_founded',
                key: 'year_founded',
                ...this.getColumnSearchProps('year_founded'),
            },
            {
                title: 'Year of decay',
                dataIndex: 'year_of_decay',
                key: 'year_of_decay',
                ...this.getColumnSearchProps('year_of_decay'),
            },
            {
                title: 'Rate',
                dataIndex: 'rate',
                key: 'rate',
                ...this.getColumnSearchProps('rate'),
            },
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
                ...this.getColumnSearchProps('country'),
            },
            {
                title: 'Musical direction',
                dataIndex: 'musical_direction',
                key: 'musical_direction',
                ...this.getColumnSearchProps('musical_direction'),
            },
            {
                title: 'Actions',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => this.openEditModal(record)}>Edit</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>Delete</a>
                    </span>
                ),
            },
        ];

        let country_options;

        if (countries && countries.length > 0) {
            country_options = countries.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }

        // console.log(albums);
        let musical_direction_options;

        if (musical_directions && musical_directions.length > 0) {
            musical_direction_options = musical_directions.map((item, i) => (
                <Option value={item.id} key={i}>{item.name}</Option>
            ))
        }


        return (
            <div>
                <Button type="primary" onClick={this.showModal} className={'mb-20'}>Add Rock Band</Button>
                <Modal
                    visible={visible}
                    title="Edit Rock Band"
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
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="name"
                                   value={this.state.name}/>
                        </Form.Item>

                        <Form.Item label="Year founded">
                            <MaskedInput placeholder="Enter year founded" mask="1111-11-11" onChange={this.onChange} name="year_founded"
                                         value={this.state.year_founded}/>
                        </Form.Item>
                        <Form.Item label="Year of decay">
                            <MaskedInput placeholder="Enter year of decay" mask="1111-11-11" onChange={this.onChange} name="year_of_decay"
                                         value={this.state.year_of_decay}/>
                        </Form.Item>
                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('rate')}
                                         value={this.state.rate}/>
                        </Form.Item>
                        <Form.Item label="Country">
                            <Select onChange={this.onChangeSelectCountry} name="country_id" value={this.state.country_id}>
                                {country_options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Musical Direction">
                            <Select onChange={this.onChangeSelectMusical_direction} name="musical_direction_id" value={this.state.musical_direction_id}>
                                {musical_direction_options}
                            </Select>
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
                    title="Edit Rock Band"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditCancel}
                    footer={[
                        <Button key="back" onClick={this.handleEditCancel}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleEditOk}>
                            Save
                        </Button>,
                    ]}
                >

                    <Form layout={'vertical'}>
                        <Form.Item label="Name">
                            <Input placeholder="Enter name" onChange={this.onChange} name="edit_name"
                                   value={this.state.edit_name}/>
                        </Form.Item>

                        <Form.Item label="Year Founded">
                            <MaskedInput placeholder="Enter year founded" mask="1111-11-11" onChange={this.onChange} name="edit_year_founded"
                                         value={this.state.edit_year_founded}/>
                        </Form.Item>
                        <Form.Item label="Year of Decay">
                            <MaskedInput placeholder="Enter year of decay" mask="1111-11-11" onChange={this.onChange} name="edit_year_of_decay"
                                         value={this.state.edit_year_of_decay}/>
                        </Form.Item>
                        <Form.Item label="Rate">
                            <InputNumber placeholder="Enter rate" min={0} max={5} onChange={this.onNumberChange('edit_rate')}
                                         value={this.state.edit_rate}/>
                        </Form.Item>
                        <Form.Item label="Country">
                            <Select onChange={this.onChangeSelectCountryUpdate} name="edit_country_id" value={this.state.edit_country_id}>
                                {country_options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Musical Direction">
                            <Select onChange={this.onChangeSelectMusical_directionUpdate} name="edit_musical_direction_id" value={this.state.edit_musical_direction_id}>
                                {musical_direction_options}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Изображения Предпочитаемый Размер 500х650
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

                <Table columns={columns} dataSource={data}/>


            </div>
        )
    }
}

Articles.propTypes = {}
export default withRouter(Articles);