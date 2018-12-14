export default [
  {
    name: '__slot:actions',
    title: '',
    titleClass: 'center aligned',
    dataClass: '',
  },
  {
    name: 'name',
    sortField: 'name',
  }, 
  {
    name: 'email',
    sortField: 'email'
  },
  {
    name: 'birthdate',
    sortField: 'birthdate',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    callback: 'formatDate|DD-MM-YYYY'
  },
  {
    name: 'nickname',
    sortField: 'nickname',
    callback: 'allcap'
  },
  {
    name: 'gender',
    sortField: 'gender',
    titleClass: 'center aligned',
    dataClass: 'center aligned',
    callback: 'genderLabel'
  },
  {
    name: 'salary',
    sortField: 'salary',
    titleClass: 'center aligned',
    dataClass: 'right aligned',
    callback: 'formatNumber'
  }
]