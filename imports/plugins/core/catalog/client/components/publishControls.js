import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Meteor } from "meteor/meteor";
import { ReactiveVar } from "meteor/reactive-var";
import { Components } from "@reactioncommerce/reaction-components";
import {
  Button,
  FlatButton,
  Switch,
  Icon
} from "/imports/plugins/core/ui/client/components";
import { Translatable } from "/imports/plugins/core/ui/client/providers";

/** TMP **/
import { i18next, Reaction } from "/client/api";

class PublishControls extends Component {
  static propTypes = {
    documentIds: PropTypes.arrayOf(PropTypes.string),
    documents: PropTypes.arrayOf(PropTypes.object),
    isEnabled: PropTypes.bool,
    isPreview: PropTypes.bool,
    onAction: PropTypes.func,
    onAddProduct: PropTypes.func,
    onPublishClick: PropTypes.func,
    onViewContextChange: PropTypes.func,
    onVisibilityChange: PropTypes.func,
    revisions: PropTypes.arrayOf(PropTypes.object),
    showViewAsControls: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
    translation: PropTypes.shape({
      lang: PropTypes.string
    })
  }

  static defaultProps = {
    showViewAsControls: true
  }

  constructor(props) {
    super(props);

    this.currentProductHash = new ReactiveVar([]);

    this.handleToggleShowChanges = this.handleToggleShowChanges.bind(this);
    this.handlePublishClick = this.handlePublishClick.bind(this);
  }

  state = {
    isHashUpdating: false,
    showDiffs: false
  };

  componentWillReceiveProps() {
    this.setState({
      isHashUpdating: false
    });
  }

  componentDidUpdate() {
    // Re-calculate hash after publishing
    this.renderHashCalculation();
  }

  handleToggleShowChanges() {
    this.setState({
      showDiffs: !this.state.showDiffs
    });
  }

  handlePublishClick() {
    if (this.props.onPublishClick) {
      this.props.onPublishClick(this.props.revisions);

      this.setState({
        isHashUpdating: true
      });
    }
  }

  handleVisibilityChange = (event, value) => {
    if (this.props.onVisibilityChange) {
      let isDocumentVisible = false;

      if (value === "public") {
        isDocumentVisible = true;
      }

      this.props.onVisibilityChange(event, isDocumentVisible, this.props.documentIds);
    }
  }

  handleAction = (event, value) => {
    if (this.props.onAction) {
      this.props.onAction(event, value, this.props.documentIds);
    }
  }

  onViewContextChange = (event, isChecked) => {
    if (typeof this.props.onViewContextChange === "function") {
      this.props.onViewContextChange(event, isChecked ? "customer" : "administrator");
    }
  }

  get showChangesButtonLabel() {
    if (!this.showDiffs) {
      return "Show Changes";
    }

    return "Hide Changes";
  }

  get showChangesButtoni18nKeyLabel() {
    if (!this.showDiffs) {
      return "app.showChanges";
    }

    return "app.hideChanges";
  }

  get primaryRevision() {
    const { revisions } = this.props;
    if (Array.isArray(revisions) && revisions.length) {
      const primaryDocumentId = this.props.documentIds[0];
      return revisions.find((revision) => revision.documentId === primaryDocumentId);
    }
    return false;
  }

  get revisionIds() {
    if (this.hasRevisions) {
      return this.props.revisions.map((revision) => revision._id);
    }
    return false;
  }

  get hasRevisions() {
    return Array.isArray(this.props.revisions) && this.props.revisions.length;
  }

  get diffs() {
    return this.props.revisions;
  }

  get showDiffs() {
    return this.diffs && this.state.showDiffs;
  }

  get isVisible() {
    if (Array.isArray(this.props.revisions) && this.props.revisions.length && this.primaryRevision) {
      const primaryRevisionObj = this.primaryRevision;

      if (primaryRevisionObj.documentData.isVisible) {
        return "public";
      }
    } else if (Array.isArray(this.props.documents) && this.props.documents.length) {
      const primaryDocument = this.props.documents[0];

      if (primaryDocument.isVisible) {
        return "public";
      }
    }

    return "private";
  }

  /**
   * Getter hasChanges
   * @return {Boolean} one or more revision has changes
   */
  get hasChanges() {
    // Verify we even have any revision at all
    if (this.hasRevisions) {
      // Loop through all revisions to determine if they have changes
      const diffHasActualChanges = this.props.revisions.map((revision) => {
        // We probably do have chnages to publish
        // Note: Sometimes "updatedAt" will cause false positives, but just incase, lets
        // enable the publish button anyway.
        if ((Array.isArray(revision.diff) && revision.diff.length) || revision.documentType !== "product") {
          return true;
        }

        // If all else fails, we will disable the button
        return false;
      });

      // If even one revision has changes we should enable the publish button
      return diffHasActualChanges.some((element) => element === true);
    }

    // No revisions, no publishing
    return false;
  }

  renderDeletionStatus() {
    if (this.hasChanges) {
      if (this.primaryRevision && this.primaryRevision.documentData.isDeleted) {
        return (
          <Button
            label="Archived"
            onClick={this.handleRestore}
            status="danger"
            i18nKeyLabel="app.archived"
          />
        );
      }
    }

    return null;
  }

  renderPublishButton() {
    const buttonProps = {};

    if (Array.isArray(this.props.documentIds) && this.props.documentIds.length > 1) {
      buttonProps.label = "Publish All";
      buttonProps.i18nKeyLabel = "toolbar.publishAll";
    }

    const isDisabled = Array.isArray(this.props.documentIds) && this.props.documentIds.length === 0;

    return (
      <div className="hidden-xs">
        {this.renderChangesNotification()}
        <Button
          bezelStyle="outline"
          disabled={isDisabled}
          label="Publish"
          onClick={this.handlePublishClick}
          status="success"
          tooltip={"This product has changes that need to be published before they are visible to your customers."}
          i18nKeyLabel="productDetailEdit.publish"
          {...buttonProps}
        />
      </div>
    );
  }

  renderViewControls() {
    if (this.props.showViewAsControls) {
      let tooltip = "Private";
      let i18nKeyTooltip = "app.private";

      if (this.isVisible === "public") {
        tooltip = "Public";
        i18nKeyTooltip = "app.public";
      }

      return (
        <div className="hidden-xs">
          <FlatButton
            i18nKeyTooltip={i18nKeyTooltip}
            icon="fa fa-eye-slash"
            onIcon="fa fa-eye"
            toggle={true}
            tooltip={tooltip}
            value="public"
            onValue="private"
            toggleOn={this.isVisible === "public"}
            onToggle={this.handleVisibilityChange}
          />
        </div>
      );
    }

    return null;
  }

  renderArchiveButton() {
    return (
      <FlatButton
        tooltip="Archive"
        i18nKeyTooltip="app.archive"
        icon={"fa fa-archive"}
        value="archive"
        onClick={this.handleAction}
      />
    );
  }

  renderSettingsButton() {
    return (
      <FlatButton
        icon={"fa fa-cog"}
        value="settings"
        onClick={this.handleAction}
      />
    );
  }

  renderVisibilitySwitch() {
    return (
      <Switch
        i18nKeyLabel={"admin.dashboard.preview"}
        label={"Preview"}
        checked={this.props.isPreview}
        onChange={this.onViewContextChange}
      />
    );
  }

  renderAdminButton() {
    return (
      <FlatButton
        onClick={() => {
          Reaction.showActionView({
            i18nKeyTitle: "dashboard.coreTitle",
            title: "Dashboard",
            template: "dashboardPackages"
          });
        }}
      >
        <Icon style={{ fontSize: 24 }} icon="icon icon-reaction-logo" />
      </FlatButton>
    );
  }

  renderAddButton() {
    return (
      <FlatButton
        i18nKeyTooltip={"app.shortcut.addProduct"}
        icon={"fa fa-plus"}
        tooltip={"Add Product"}
        onClick={this.props.onAddProduct}
      />
    );
  }

  renderHashCalculation = () => {
    const productDocument = this.props && this.props.documents && this.props.documents[0];

    if (productDocument) {
      Meteor.call("products/getpublishedProductHash", productDocument._id, (err, result) => {
        if (err) {
          Alerts.toast(i18next.t("admin.catalogCalculateHashError", { err: err.reason }), "error");
        }
        if (result) {
          this.currentProductHash.set(result);
        }
      });
    }
    return;
  }

  renderChangesNotification = () => {
    const publishedProductHash = (this.props && this.props.documents && this.props.documents[0] && this.props.documents[0].publishedProductHash) || null;
    const { isHashUpdating } = this.state;

    // Calculate hash to compare
    this.renderHashCalculation();
    const currentProductHash = this.currentProductHash.get();

    const hashIndicator = classnames({
      "rui": true,
      "hash-icon": true,
      "fa-stack": true,
      "fa-lg": true,
      "hash-icon-visible": publishedProductHash !== currentProductHash,
      "hash-icon-hidden": publishedProductHash === currentProductHash
    });

    const primaryIcon = classnames({
      "fa": true,
      "fa-stack-2x": true,
      "fa-circle": isHashUpdating,
      "fa-circle-o": !isHashUpdating
    });

    const secondaryIcon = classnames({
      "fa": true,
      "fa-stack-1x": true,
      "fa-refresh": isHashUpdating,
      "fa-circle": !isHashUpdating,
      "fa-spin": isHashUpdating
    });

    // We don't use the `<Icon>` component here as we do not have layered
    // icons built in to the existing component
    return (
      <span className={hashIndicator} style={{ fontSize: 12, position: "absolute", top: "2px", right: "8px" }}>
        <i className={primaryIcon} style={{ color: "#ffffff" }} />
        <i className={secondaryIcon} style={{ fontSize: "1.5em", color: "#f4c43c" }} />
      </span>
    );
  }

  render() {
    return (
      <Components.ToolbarGroup lastChild={true}>
        {this.renderDeletionStatus()}
        {this.renderArchiveButton()}
        {this.renderViewControls()}
        {this.renderPublishButton()}
      </Components.ToolbarGroup>
    );
  }
}

export default Translatable()(PublishControls);
