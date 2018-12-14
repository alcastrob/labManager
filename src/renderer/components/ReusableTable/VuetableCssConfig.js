export default {
  table: {
    tableClass: "table table-striped table-bordered",
    ascendingIcon: "fas fa-sort-amount-down",
    descendingIcon: "fas fa-sort-amount-up",
    handleIcon: "fas fa-bars",
    renderIcon: function(classes, options) {
      return `<span class="${classes.join(' ')}"></span>`
    }
  },
  paginationInfo: {
    infoClass: 'pull-left'
  },
  pagination: {
    wrapperClass: "",
    activeClass: "btn-primary",
    disabledClass: "disabled",
    pageClass: "btn btn-border",
    linkClass: "btn btn-border",
    icons: {
      first: "",
      prev: "",
      next: "",
      last: ""
    }
  }
};
