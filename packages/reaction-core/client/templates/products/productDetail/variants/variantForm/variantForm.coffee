Template.variantForm.helpers
  variantDetails: ->
    product = selectedProduct()
    unless @.parentId?
      Template.parentVariantForm
    else
      Template.childVariantForm

  childVariants: () ->
    product = selectedProduct()
    variants = (variant for variant in product.variants when variant?.parentId is this._id)
    if variants then return variants

  nowDate: () ->
    new Date()

  variantFormId: () ->
    "variant-form-"+@._id

  variantFormVisible: () ->
    unless Session.equals "variant-form-"+@._id, true
      return "hidden"

  displayInventoryManagement: () ->
    unless @inventoryManagement is true
      return "display:none;"

  displayLowInventoryWarning: () ->
    unless @inventoryManagement is true
      return "display:none;"

Template.variantForm.events
  "change form :input": (event,template) ->
    # auto-submit the variant form whenever any fields are changed
    formId = "#variant-form-"+template.data._id
    template.$(formId).submit()
    setCurrentVariant template.data._id

  "click .btn-child-variant-form": (event,template) ->
    event.stopPropagation()
    event.preventDefault()
    productId = selectedProductId()
    return unless productId
    Meteor.call "cloneVariant", productId, template.data._id, @._id

  "click .btn-remove-variant": (event, template) ->
    title = @.title || "this variant"
    if confirm("Are you sure you want to delete "+ title)
      id = @._id
      Meteor.call "deleteVariant", id, (error, result) ->
        if result and selectedVariantId() is id
          setCurrentVariant null

  "click .btn-clone-variant": (event,template) ->
    event.stopPropagation()
    event.preventDefault()
    productId = selectedProductId()
    return unless productId
    Meteor.call "cloneVariant", productId, template.data._id, (error,result) ->
      toggleSession "variant-form-"+result