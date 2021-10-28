import React, { Component, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';
import Coin from '../../../both/utils/coins.js';
import TimeStamp from '../components/TimeStamp.jsx'; 
import voca from 'voca';
import { Meteor } from 'meteor/meteor';  
import { Markdown } from 'react-showdown';
import { Helmet } from 'react-helmet';
import { ProposalStatusIcon } from '../components/Icons';
import ChainStates from '../components/ChainStatesContainer.js'
import { Row, Col, Card, CardText, Table, CardTitle, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Spinner } from 'reactstrap'; 
const T = i18n.createComponent();  

const ListRow = (props) => { 

    const [bCollapse, setCollapse] = useState(true);    
    return <><tr >   
        <td className="title"> 
            <img src={props.item.img} style={{width:'45px', height:'45px', border:'1px solid rgba(0,0,0,.3)', marginRight:'10px', borderRadius:'12px'}} className="moniker-avatar-list img-fluid"/>
            <Link to={"/easel_transactions"} style={{display:'inline-block', paddingTop:'10px', color:'#444444'}} onClick={() => setCollapse(!bCollapse)}> {props.item.Name} </Link>
            <Link to="/easel_transactions" className="btn btn-link" style={{margin: 'auto'}} onClick={() => setCollapse(!bCollapse)}><i className={bCollapse ? "fas fa-caret-down" : "fas fa-caret-up"}></i> </Link>

        </td>      
        <td className="voting-start" style={{paddingTop:'22px'}}>{props.item.Description}</td>
        <td className="title" style={{paddingTop:'22px'}}>{props.item.price}</td> 
          
         
    </tr> 
    <tr hidden={bCollapse}>
        <td colSpan={3}>
            <Card body style={{paddingBottom:'20px'}}>  
            <div className="proposal bg-light">
                <Row className="mb-2">
                    <Col md={3} className="label"><T>recipes.no</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.NO}</Col> 
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.recipeID</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.ID}</Col> 
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.name</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.Name}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.description</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value"><Markdown markup={props.item.Description} /></Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.price</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.price}</Col>
                </Row>  
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.sender</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.owner}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.cookbookID</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.cookbookID}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.cookbookowner</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.item.owner}</Col>
                </Row> 
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.deeplinks</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value"><a href={""+props.item.deeplink+""} style={{wordBreak:'break-all'}} target="_blank">{props.item.deeplink}</a></Col>
                </Row>  
            </div>
            <Row className='clearfix' style={{marginTop:'-37px'}}>
                <Link to="/easel_transactions" className="btn btn-primary" style={{margin: 'auto'}} onClick={() => setCollapse(true)}><i className="fas fa-caret-up"></i> <T>common.collapse</T></Link>
            </Row>
        </Card> 
        </td>  
    </tr></>
}

const RecipeRow = (props) => { 

    const [bCollapse, setCollapse] = useState(true);    
    return <><tr >   
        <td className="title">
            {/* <a href={""+props.recipe.deeplink+""} target="_blank"> */} 
            <img src={props.recipe.img} style={{width:'45px', height:'45px', border:'1px solid rgba(0,0,0,.3)', marginRight:'10px', borderRadius:'12px'}} className="moniker-avatar-list img-fluid"/>
            <Link to={"/easel_transactions"} style={{display:'inline-block', paddingTop:'10px', color:'#444444'}} onClick={() => setCollapse(!bCollapse)}> {props.recipe.Name} </Link>
            {/* </a> */} 
            <Link to="/easel_transactions" className="btn btn-link" style={{margin: 'auto'}} onClick={() => setCollapse(!bCollapse)}><i className={bCollapse ? "fas fa-caret-down" : "fas fa-caret-up"}></i> </Link>

        </td>    
        {props.recipe.nftsExist && <td className="title">
            <Link to={"/easel_transactions/"+props.recipe.creator} style={{display:'inline-block', paddingTop:'10px', color:'#444444'}}>{props.recipe.cookbook_owner}</Link>  
        </td>}
        {!props.recipe.nftsExist && <td className="title" style={{paddingTop:'22px'}}>
            {props.recipe.cookbook_owner}
        </td>}
        <td className="title" style={{paddingTop:'22px'}}>{props.recipe.price}</td> 
        <td className="voting-start" style={{paddingTop:'22px'}}>{props.recipe.Description}</td>
        {window.orientation == undefined && <td className="title" style={{paddingLeft:'36px', paddingTop:'22px'}}>{props.recipe.copies}</td> }
        {window.orientation != undefined && <td className="title" style={{paddingTop:'22px'}}>{props.recipe.copies}</td> } 
        {/* <td className="voting-start text-right"><a href={""+props.recipe.deeplink+""} target="_blank">{props.recipe.deeplink}</a></td>  */}
         
    </tr> 
    <tr hidden={bCollapse}>
        <td colSpan={5}>
            <Card body style={{paddingBottom:'20px'}}>  
            <div className="proposal bg-light">
                <Row className="mb-2">
                    <Col md={3} className="label"><T>recipes.no</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.NO}</Col> 
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.recipeID</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.ID}</Col> 
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.name</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.Name}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.description</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value"><Markdown markup={props.recipe.Description} /></Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.price</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.price}</Col>
                </Row> 
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.status</T></Col> 
                    <Col md={9} style={{paddingLeft:"40px"}} className="value"><ProposalStatusIcon status={props.recipe.Disabled ? 'PROPOSAL_STATUS_REJECTED' : 'PROPOSAL_STATUS_PASSED'}/> {props.recipe.Disabled ? "Disalbed" : "Enabled"}</Col>

                </Row> 
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.sender</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.creator}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.cookbookID</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.CookbookID}</Col>
                </Row>
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.cookbookowner</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.cookbook_owner}</Col>
                </Row> 
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.deeplinks</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value"><a href={""+props.recipe.deeplink+""} style={{wordBreak:'break-all'}} target="_blank">{props.recipe.deeplink}</a></Col>
                </Row> 
                <Row className="mb-2 border-top">
                    <Col md={3} className="label"><T>recipes.total_copies</T></Col>
                    <Col md={9} style={{paddingLeft:"40px"}} className="value">{props.recipe.copies}</Col>
                </Row>
            </div>
            <Row className='clearfix' style={{marginTop:'-37px'}}>
                <Link to="/easel_transactions" className="btn btn-primary" style={{margin: 'auto'}} onClick={() => setCollapse(true)}><i className="fas fa-caret-up"></i> <T>common.collapse</T></Link>
            </Row>
        </Card> 
        </td>  
    </tr></>
}
 

export default class List extends Component{
    constructor(props){
        super(props);  
        if (Meteor.isServer){ 
            return;
            if (this.props.recipes.length > 0){ 
                var _recipes = this.props.recipes.sort(function (a,b) {
                    const coinInputs1 = a.CoinInputs;
                    const coinInputs2 = b.CoinInputs;
                    var price1 = 0, price2 = 0; 
                    if (coinInputs1.length > 0) {
                        if(coinInputs1[0].Coin == "USD"){
                            price1 = coinInputs1[0].Count / 100;
                        }
                        else{
                            price1 = coinInputs1[0].Count * 100;
                        }
                    }
                    else{
                        return 0;
                    }

                    if (coinInputs2.length > 0) {
                        if(coinInputs2[0].Coin == "USD"){
                            price2 = coinInputs2[0].Count / 100;
                        }
                        else{
                            price2 = coinInputs2[0].Count * 100;
                        }
                    }
                    else{
                        return 0;
                    }

                    if (price1 > price2){
                         return -1;
                    }
                    if (price2 < price2){
                         return 1;
                    }
                    return 0;
                });

                var pos = 0;
                for (var i = 1; i < _recipes.length; i++) { 
                    var _recipe = _recipes[i];
                    let nfts = null;
                    if(this.props.nfts != null){
                        nfts = this.props.nfts.filter((nft) => nft.CookbookID == _recipe.CookbookID); 
                    }
                    if(nfts != null && nfts.length > 0){ 
                        _recipes.splice(pos, 0, _recipes.splice(i, 1)[0]);
                        pos = pos + 1;
                    }
                }

                this.state = {
                    recipes: _recipes.map((recipe, i) => {
                        const coinInputs = recipe.CoinInputs;
                        var price = "No Price"
                        if (coinInputs.length > 0) {
                            if(coinInputs[0].Coin == "USD"){
                                price = Math.floor(coinInputs[0].Count / 100) + '.' + (coinInputs[0].Count % 100) + ' ' + coinInputs[0].Coin;
                            }
                            else{
                                price = coinInputs[0].Count + ' ' + coinInputs[0].Coin
                            }
                        }
                        var copies = 0;
                        var img = "/img/buy_icon.png";
                        const entries = recipe.Entries;
                        if(entries != null){
                            const itemOutputs = entries.ItemOutputs;
                            if(itemOutputs != null && itemOutputs[0] != null){
                                const longs = itemOutputs[0].Longs;
                                if(longs != null && longs[0] != null){
                                    const quantity = longs[0].WeightRanges;
                                    if(quantity != null && quantity[0] != null){ 
                                        copies = quantity[0].Lower * quantity[0].Weight
                                    }
                                }
                            }
                           
                            let strings = itemOutputs[0].Strings
                            for (i = 0; i < strings.length; i++) {
                                try {
                                    var values = strings[i].Value;
                                    if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
                                        img = values; 
                                        break;
                                    }
                                } catch (e) {
                                    console.log('strings[i].Value', e)
                                    break;
                                }

                            }
                        }  
                        let nfts = null;
                        if(this.props.nfts != null){
                            nfts = this.props.nfts.filter((nft) => nft.owner == recipe.creator); 
                        }

                        recipe.price = price;
                        recipe.copies = copies; 
                        recipe.img = img;  
                        recipe.nftsExist = (nfts != null && nfts.length > 0);
                        
                        return <RecipeRow key={i} index={i} recipe={recipe}/>
                    }),
                    bCollapse: false
                }
            }
        }
        else{
            this.state = {
                items: null,
                recipes: null,
                bCollapse: false
            }
        }
    }  
    
    componentDidUpdate(prevState){   
        if (this.props.recipes && this.props.recipes != prevState.recipes){ 
            if (this.props.recipes.length > 0){ 
                let _recipes = this.props.recipes;
                _recipes.sort(function (a,b) {
                    const coinInputs1 = a.CoinInputs;
                    const coinInputs2 = b.CoinInputs;
                    let price1 = 0, price2 = 0; 
                    if (coinInputs1.length > 0) {
                        if(coinInputs1[0].Coin == "USD"){
                            price1 = coinInputs1[0].Count / 100;
                        }
                        else{
                            price1 = coinInputs1[0].Count * 100;
                        }
                    }
                    else{
                        return 0;
                    }

                    if (coinInputs2.length > 0) {
                        if(coinInputs2[0].Coin == "USD"){
                            price2 = coinInputs2[0].Count / 100;
                        }
                        else{
                            price2 = coinInputs2[0].Count * 100;
                        }
                    }
                    else{
                        return 0;
                    }

                    if (price1 > price2){
                         return -1;
                    }
                    if (price2 < price2){
                         return 1;
                    }
                    return 0;
                });
              
                let items = [];
                for (let i = 1; i < _recipes.length; i++) { 
                    let _recipe = _recipes[i];
                    let nfts = null;
                    if(this.props.nfts != null){
                        nfts = this.props.nfts.filter((nft) => nft.CookbookID == _recipe.CookbookID); 
                    } 
                    if(nfts != null && nfts.length > 0){ 
                        items.push(_recipe);
                    }
                } 
                  
                this.setState({
                    items: items.map((item, i) => {
                        const coinInputs = item.CoinInputs;
                        var price = "No Price"
                        if (coinInputs.length > 0) {
                            if(coinInputs[0].Coin == "USD"){
                                price = Math.floor(coinInputs[0].Count / 100) + '.' + (coinInputs[0].Count % 100) + ' ' + coinInputs[0].Coin;
                            }
                            else{
                                price = coinInputs[0].Count + ' ' + coinInputs[0].Coin
                            }
                        }
                        var copies = 0;
                        var img = "/img/buy_icon.png";
                        const entries = item.Entries;
                        if(entries != null){
                            const itemOutputs = entries.ItemOutputs;
                            if(itemOutputs != null && itemOutputs[0] != null){
                                const longs = itemOutputs[0].Longs;
                                if(longs != null && longs[0] != null){
                                    const quantity = longs[0].WeightRanges;
                                    if(quantity != null && quantity[0] != null){ 
                                        copies = quantity[0].Lower * quantity[0].Weight
                                    }
                                }
                            }

                            let strings = itemOutputs[0].Strings
                            for (i = 0; i < strings.length; i++) {
                                try {
                                    var values = strings[i].Value;
                                    if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
                                        img = values; 
                                        break;
                                    }
                                } catch (e) {
                                    console.log('strings[i].Value', e)
                                    break;
                                }

                            }
                        } 
                        
                        let nfts = null;
                        if(this.props.nfts != null){
                            nfts = this.props.nfts.filter((nft) => nft.owner == item.owner); 
                        } 
                        item.price = price;
                        item.copies = copies; 
                        item.img = img;  
                        item.nftsExist = (nfts != null && nfts.length > 0); 
                        return <ListRow key={i} index={i} item={item} />
                    }),
                    bCollapse: false,
                    recipes: this.props.recipes.map((recipe, i) => {
                        const coinInputs = recipe.CoinInputs;
                        var price = "No Price"
                        if (coinInputs.length > 0) {
                            if(coinInputs[0].Coin == "USD"){
                                price = Math.floor(coinInputs[0].Count / 100) + '.' + (coinInputs[0].Count % 100) + ' ' + coinInputs[0].Coin;
                            }
                            else{
                                price = coinInputs[0].Count + ' ' + coinInputs[0].Coin
                            }
                        }
                        var copies = 0;
                        var img = "/img/buy_icon.png";
                        const entries = recipe.Entries;
                        if(entries != null){
                            const itemOutputs = entries.ItemOutputs;
                            if(itemOutputs != null && itemOutputs[0] != null){
                                const longs = itemOutputs[0].Longs;
                                if(longs != null && longs[0] != null){
                                    const quantity = longs[0].WeightRanges;
                                    if(quantity != null && quantity[0] != null){ 
                                        copies = quantity[0].Lower * quantity[0].Weight
                                    }
                                }
                            }

                            let strings = itemOutputs[0].Strings
                            for (i = 0; i < strings.length; i++) {
                                try {
                                    var values = strings[i].Value;
                                    if (values.indexOf('http') >= 0 && (values.indexOf('.png') > 0 || values.indexOf('.jpg') > 0)) {
                                        img = values; 
                                        break;
                                    }
                                } catch (e) {
                                    console.log('strings[i].Value', e)
                                    break;
                                }

                            }
                        } 
                        
                        let nfts = null;
                        if(this.props.nfts != null){
                            nfts = this.props.nfts.filter((nft) => nft.owner == recipe.creator); 
                        } 
                        recipe.price = price;
                        recipe.copies = copies; 
                        recipe.img = img;  
                        recipe.nftsExist = (nfts != null && nfts.length > 0); 
                        return <RecipeRow key={i} index={i} recipe={recipe} />
                    }),  
                }) 
            }
        }
    }

    render(){
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            return (
                <div>
                    {/* {this.state.user?<SubmitProposalButton history={this.props.history}/>:null} */}
                    <Table striped className="proposal-list">
                        <thead>
                            <tr>  
                                <th className="submit-block"><i className="fas fa-gift"></i> <span className="d-none d-sm-inline"><T>recipes.title</T></span></th> 
                                <th className="submit-block"><i className="fas fa-box"></i> <span className="d-none d-sm-inline"><T>recipes.description</T></span></th>
                                {window.orientation == undefined && <th className="submit-block col-4 col-md-2 col-lg-1"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.price</T></span></th>}
                                {window.orientation != undefined && <th className="submit-block"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.price</T></span></th>}
                                
                                {/* <th className="voting-start"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.deeplinks</T></span></th>  */}
                            </tr>
                        </thead>
                        <tbody>{this.state.items}</tbody> 
                    </Table>
                    <p className="lead"><T>recipes.listOfRecipes</T></p>
                    <Table striped className="proposal-list">
                        <thead>
                            <tr>  
                                <th className="submit-block"><i className="fas fa-gift"></i> <span className="d-none d-sm-inline"><T>recipes.title</T></span></th> 
                                <th className="submit-block"><i className="fas fa-box"></i> <span className="d-none d-sm-inline"><T>recipes.artist</T></span></th>
                                {window.orientation == undefined && <th className="submit-block col-4 col-md-2 col-lg-1"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.price</T></span></th>}
                                {window.orientation != undefined && <th className="submit-block"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.price</T></span></th>}
                                <th className="submit-block" ><i className="fas fa-box"></i> <span className="d-none d-sm-inline"><T>recipes.description</T></span></th>
                                {window.orientation == undefined && <th className="submit-block col-4 col-md-1 col-lg-1"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.copies</T></span></th>}
                                {window.orientation != undefined && <th className="submit-block"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.copies</T></span></th>}
                                {/* <th className="voting-start"><i className="fas fa-box-open"></i> <span className="d-none d-sm-inline"><T>recipes.deeplinks</T></span></th>  */}
                            </tr>
                        </thead>
                        <tbody>{this.state.recipes}</tbody> 
                    </Table> 
                </div>
            )
        }
    }
}