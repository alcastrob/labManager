<script>
// This copy of WorksList is here because I found no other way to avoid caching of the works listing.
// When the user is navigating via WorkListing -> Works, it's neccesary to have it cached (for keepint the filter, pagination and sorting state).
// When the user is navifating to a dentist and clicking on the "see her works" button, it's neccesary to not have it cached (Two consecutive navitions will conserve all the values, causing a weird effect).
import worksListMixin from './WorksListMixin'
export default {
  name: 'worksListUncached',
  mixins: [worksListMixin]
}
</script>
