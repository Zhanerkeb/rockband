import React, { Component } from 'react'
import {Route, withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout, Menu } from 'antd';
import AboutUs from './About-us';
import Articles from './Articles';
import News from './News';
import Categories from './Categories';
import MainPage from './Main-page';
import Products from './Products';
import Contacts from './Contacts';
import Review from './Review';
import Sotrudnichestvo from './Sotrudnichestvo';
import TopSales from './TopSales';
import RockBands from './RockBands';
import Songs from './Songs';
import Albums from './Albums';
import Festival from './Festival';
import Performance from './Performance';
import MusicalDirections from './Musical-directions';
import Countries from './Countries';

const { Content, Footer, Sider } = Layout;

class Main extends Component {



    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){

    }

    render (){


        return(

            <Layout style={{minHeight: '100vh'}}>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                        {/*<Menu.Item key="1">*/}
                        {/*    <Link to={`/main/news`} className="nav-text">Новости</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="2">*/}
                        {/*    <Link to={`/main/articles`} className="nav-text">Статьи</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="3">*/}
                        {/*    <Link to={`/main/categories`} className="nav-text">Категории</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="4">*/}
                        {/*    <Link to={`/main/products`} className="nav-text">Продукты</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="5">*/}
                        {/*    <Link to={`/main/main-page`} className="nav-text">Главная страница</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="6">*/}
                        {/*    <Link to={`/main/about-us`} className="nav-text">Страница о нас</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="7">*/}
                        {/*    <Link to={`/main/contacts`} className="nav-text">Страница контакты</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="8">*/}
                        {/*    <Link to={`/main/reviews`} className="nav-text">Отзывы</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="9">*/}
                        {/*    <Link to={`/main/sotrudnichestvo`} className="nav-text">Сотрудничество</Link>*/}
                        {/*</Menu.Item>*/}
                        {/*<Menu.Item key="10">*/}
                        {/*    <Link to={`/main/topsales`} className="nav-text">Лидеры продаж</Link>*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="12">
                            <Link to={`/main/rock-bands`} className="nav-text">Rock Bands</Link>
                        </Menu.Item>
                        <Menu.Item key="13">
                            <Link to={`/main/musical-directions`} className="nav-text">Musical directions</Link>
                        </Menu.Item>
                        <Menu.Item key="18">
                            <Link to={`/main/countries`} className="nav-text">Countries</Link>
                        </Menu.Item>
                        <Menu.Item key="14">
                            <Link to={`/main/songs`} className="nav-text">Songs</Link>
                        </Menu.Item>
                        <Menu.Item key="15">
                            <Link to={`/main/albums`} className="nav-text">Albums</Link>
                        </Menu.Item>
                        <Menu.Item key="16">
                            <Link to={`/main/festivals`} className="nav-text">Festivals</Link>
                        </Menu.Item>
                        <Menu.Item key="17">
                            <Link to={`/main/performances`} className="nav-text">Performances</Link>
                        </Menu.Item>
                        <Menu.Item key="11">
                            <Link to={`/admin`}  className="nav-text">Sign out</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <Route exact path={`/main/main-page`} component={MainPage}/>
                            <Route exact path={`/main/about-us`} component={AboutUs}/>
                            <Route exact path={`/main/contacts`} component={Contacts}/>
                            <Route exact path={`/main/news`} component={News}/>
                            <Route exact path={`/main/articles`} component={Articles}/>
                            <Route exact path={`/main/categories`} component={Categories}/>
                            <Route exact path={`/main/products`} component={Products}/>
                            <Route exact path={`/main/reviews`} component={Review}/>
                            <Route exact path={`/main/sotrudnichestvo`} component={Sotrudnichestvo}/>
                            <Route exact path={`/main/topsales`} component={TopSales}/>
                            <Route exact path={`/main/rock-bands`} component={RockBands}/>
                            <Route exact path={`/main/musical-directions`} component={MusicalDirections}/>
                            <Route exact path={`/main/songs`} component={Songs}/>
                            <Route exact path={`/main/albums`} component={Albums}/>
                            <Route exact path={`/main/festivals`} component={Festival}/>
                            <Route exact path={`/main/performances`} component={Performance}/>
                            <Route exact path={`/main/countries`} component={Countries}/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Back to Rock ©2019 Created by P&S</Footer>
                </Layout>
            </Layout>
        )

    }
}

Main.propTypes = {
    user: PropTypes.object
};

export default withRouter(Main);