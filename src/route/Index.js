import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { CustomerProvider } from "../pages/panel/e-commerce/customer/CustomerContext";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";
import { RedirectAs404 } from "../utils/Utils";

import Homepage from "../pages/Homepage";
import Sales from "../pages/Sales";
import Analytics from "../pages/Analytics";

import EcomOrder from "../pages/panel/e-commerce/order/OrderDefault";
import EcomSupport from "../pages/panel/e-commerce/support/Messages";
import EcomProducts from "../pages/panel/e-commerce/product/ProductList";
import EcomCustomer from "../pages/panel/e-commerce/customer/CustomerList";
import EcomCustomerDetails from "../pages/panel/e-commerce/customer/CustomerDetails";
import EcomIntegration from "../pages/panel/e-commerce/integration/Integration";
import EcomSettings from "../pages/panel/e-commerce/settings/Settings";
import EcomDashboard from "../pages/panel/e-commerce/index";

import Component from "../pages/components/Index";
import Accordian from "../pages/components/Accordions";
import Alerts from "../pages/components/Alerts";
import Avatar from "../pages/components/Avatar";
import Badges from "../pages/components/Badges";
import Breadcrumbs from "../pages/components/Breadcrumbs";
import ButtonGroup from "../pages/components/ButtonGroup";
import Buttons from "../pages/components/Buttons";
import Cards from "../pages/components/Cards";
import Carousel from "../pages/components/Carousel";
import Dropdowns from "../pages/components/Dropdowns";
import FormElements from "../pages/components/forms/FormElements";
import FormLayouts from "../pages/components/forms/FormLayouts";
import FormValidation from "../pages/components/forms/FormValidation";
import DataTablePage from "../pages/components/table/DataTable";
import DateTimePicker from "../pages/components/forms/DateTimePicker";
import CardWidgets from "../pages/components/widgets/CardWidgets";
import ChartWidgets from "../pages/components/widgets/ChartWidgets";
import RatingWidgets from "../pages/components/widgets/RatingWidgets";
import SlickPage from "../pages/components/misc/Slick";
import SweetAlertPage from "../pages/components/misc/SweetAlert";
import BeautifulDnd from "../pages/components/misc/BeautifulDnd";
import DualListPage from "../pages/components/misc/DualListbox";
import GoogleMapPage from "../pages/components/misc/GoogleMap";
import Modals from "../pages/components/Modals";
import Pagination from "../pages/components/Pagination";
import Popovers from "../pages/components/Popovers";
import Progress from "../pages/components/Progress";
import Spinner from "../pages/components/Spinner";
import Tabs from "../pages/components/Tabs";
import Toast from "../pages/components/Toast";
import Tooltips from "../pages/components/Tooltips";
import Typography from "../pages/components/Typography";
import CheckboxRadio from "../pages/components/forms/CheckboxRadio";
import AdvancedControls from "../pages/components/forms/AdvancedControls";
import InputGroup from "../pages/components/forms/InputGroup";
import FormUpload from "../pages/components/forms/FormUpload";
import NumberSpinner from "../pages/components/forms/NumberSpinner";
import NouiSlider from "../pages/components/forms/nouislider";
import WizardForm from "../pages/components/forms/WizardForm";
import UtilBorder from "../pages/components/UtilBorder";
import UtilColors from "../pages/components/UtilColors";
import UtilDisplay from "../pages/components/UtilDisplay";
import UtilEmbeded from "../pages/components/UtilEmbeded";
import UtilFlex from "../pages/components/UtilFlex";
import UtilOthers from "../pages/components/UtilOthers";
import UtilSizing from "../pages/components/UtilSizing";
import UtilSpacing from "../pages/components/UtilSpacing";
import UtilText from "../pages/components/UtilText";

import Blank from "../pages/others/Blank";
import Faq from "../pages/others/Faq";
import Regularv1 from "../pages/others/Regular-1";
import Regularv2 from "../pages/others/Regular-2";
import Terms from "../pages/others/Terms";
import BasicTable from "../pages/components/table/BasicTable";
import SpecialTablePage from "../pages/components/table/SpecialTable";
import ChartPage from "../pages/components/charts/Charts";
import EmailTemplate from "../pages/components/email-template/Email";
import NioIconPage from "../pages/components/crafted-icons/NioIcon";
import SVGIconPage from "../pages/components/crafted-icons/SvgIcons";

import ProjectCardPage from "../pages/pre-built/projects/ProjectCard";
import ProjectListPage from "../pages/pre-built/projects/ProjectList";
import UserListDefaultPage from "../pages/pre-built/user-manage/UserListDefault";
import UserListRegularPage from "../pages/pre-built/user-manage/UserListRegular";
import UserContactCardPage from "../pages/pre-built/user-manage/UserContactCard";
import UserDetailsPage from "../pages/pre-built/user-manage/UserDetailsRegular";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileLayout from "../pages/pre-built/user-manage/UserProfileLayout";
import OrderDefault from "../pages/pre-built/orders/OrderDefault";
import OrderRegular from "../pages/pre-built/orders/OrderRegular";
import OrderSales from "../pages/pre-built/orders/OrderSales";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";
import InvoiceList from "../pages/pre-built/invoice/InvoiceList";
import InvoiceDetails from "../pages/pre-built/invoice/InvoiceDetails";
import PricingTable from "../pages/pre-built/pricing-table/PricingTable";
import GalleryPreview from "../pages/pre-built/gallery/GalleryCardPreview";
import ReactToastify from "../pages/components/misc/ReactToastify";

import AppMessages from "../pages/app/messages/Messages";
import Chat from "../pages/app/chat/ChatContainer";
import Kanban from "../pages/app/kanban/Kanban";
import FileManager from "../pages/app/file-manager/FileManager";
import Inbox from "../pages/app/inbox/Inbox";
import Calender from "../pages/app/calender/Calender";
import JsTreePreview from "../pages/components/misc/JsTree";
import QuillPreview from "../pages/components/forms/rich-editor/QuillPreview";
import TinymcePreview from "../pages/components/forms/rich-editor/TinymcePreview";
import KnobPreview from "../pages/components/charts/KnobPreview";
import { FileManagerContextProvider } from "../pages/app/file-manager/FileManagerContext";
import Cart from "../pages/Cart";

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div />}>
      <Switch>
        {/* Cart */}
        <Route exact path={`/cart`} component={Cart}></Route>

        {/*Panel */}
        <Route exact path={`/admin`} component={EcomDashboard}></Route>
        <Route exact path={`/admin/orders`} component={EcomOrder}></Route>
        <Route exact path={`/admin/products`} component={EcomProducts}></Route>
        <Route exact path={`/admin/support`} component={EcomSupport}></Route>
        <Route
          exact
          path={`/admin/customer`}
          render={() => (
            <CustomerProvider>
              <EcomCustomer />
            </CustomerProvider>
          )}
        ></Route>
        <Route
          exact
          path={`/admin/customer-details/:id`}
          render={(props) => (
            <CustomerProvider>
              <EcomCustomerDetails {...props} />
            </CustomerProvider>
          )}
        ></Route>

        {/*Dashboards*/}
        <Route exact path={`/admin/sales`} component={Sales}></Route>
        <Route exact path={`/admin/analytics`} component={Analytics}></Route>
        <Route exact path={`/admin/_blank`} component={Blank}></Route>

        <Route //Context Api added
          exact
          path={`/admin/user-list-regular`}
          render={() => (
            <UserContextProvider>
              <UserListRegularPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`/admin/user-list-default`}
          render={() => (
            <UserContextProvider>
              <UserListDefaultPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`/admin/user-list-compact`}
          render={() => (
            <UserContextProvider>
              <UserListCompact />
            </UserContextProvider>
          )}
        ></Route>
        <Route //Context Api added
          exact
          path={`/admin/user-details-regular/:id`}
          render={(props) => (
            <UserContextProvider>
              <UserDetailsPage {...props} />
            </UserContextProvider>
          )}
        ></Route>
        <Route exact path={`/user-profile-regular/`} component={UserProfileLayout}></Route>
        <Route exact path={`/user-profile-notification`} component={UserProfileLayout}></Route>
        <Route exact path={`/user-profile-activity`} component={UserProfileLayout}></Route>
        <Route exact path={`/user-profile-setting`} component={UserProfileLayout}></Route>
        <Route //Context api added
          exact
          path={`/user-contact-card`}
          render={() => (
            <UserContextProvider>
              <UserContactCardPage />
            </UserContextProvider>
          )}
        ></Route>
        <Route exact path={`/admin/order-list-default`} component={OrderDefault}></Route>
        <Route exact path={`/admin/order-list-regular`} component={OrderRegular}></Route>
        <Route exact path={`/admin/order-list-sales`} component={OrderSales}></Route>
        <Route exact path={`/admin/product-list`} component={ProductList}></Route>

        <Route // context api added
          exact
          path={`/`}
          render={(props) => (
            <ProductContextProvider>
              <ProductCard />
            </ProductContextProvider>
          )}
        ></Route>
        <Route
          exact
          path={`/product-details/:id`}
          render={(props) => (
            <ProductContextProvider>
              <ProductDetails {...props} />
            </ProductContextProvider>
          )}
        ></Route>
        <Route exact path={`/admin/invoice-list`} component={InvoiceList}></Route>
        <Route exact path={`/invoice-details/:id`} component={InvoiceDetails}></Route>

        {/*Demo Pages*/}
        <Route exact path={`/pages/terms-policy`} component={Terms}></Route>
        <Route exact path={`/pages/faq`} component={Faq}></Route>
        <Route exact path={`/pages/regular-v1`} component={Regularv1}></Route>
        <Route exact path={`/pages/regular-v2`} component={Regularv2}></Route>

        {/*Application*/}
        <Route exact path={`/app-messages`} component={AppMessages}></Route>
        <Route exact path={`/app-chat`} component={Chat}></Route>
        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
