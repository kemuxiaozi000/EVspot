require 'test_helper'

class ChargeWelcomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get charge_welcome_index_url
    assert_response :success
  end

end
