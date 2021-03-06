import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./login"
import Header from "./Header";
import pOrders from "./views/purchaseOrder/pOrders";
import PrList from "./views/purchaseRequisitions/prList";
import bills from "./views/Bills/bills"
import PlaceAnOrder from "./views/purchaseOrder/placeAnOrder";
import ItemList from "./views/items/itemsList";
import addRequisition from "./views/requisitions/addRequisition";
import requisitionList from "./views/requisitions/requisitionDraftList";
import AddItem from "./views/items/addItems";





function Home() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/rlList" exact component={requisitionList} />
                <Route path="/prList" exact component={PrList} />
                <Route path="/pOrders" exact component={pOrders} />
                <Route path="/bills" exact component={bills} />
                <Route path="/placeAnOrder" exact component={PlaceAnOrder} />
                <Route path="/itemsList" exact component={ItemList} />
                <Route path="/sendRequisition" exact component={addRequisition} />
                <Route path="/addItems" exact component={AddItem}
                />
            </Switch >
        </Router >
    );
}

export default Home;
