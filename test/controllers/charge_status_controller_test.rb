require 'test_helper'

class ChargeStatusControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get charge_status_index_url
    assert_response :success
  end

end
