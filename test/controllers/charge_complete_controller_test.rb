require 'test_helper'

class ChargeCompleteControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get charge_complete_index_url
    assert_response :success
  end

end
