class PagesController < ApplicationController
  skip_before_action :authenticate_user!

  def terms
  end

  def privacy
  end

  def contact
    @contact = Contact.new
  end

  def create_contact
    @contact = Contact.new(contact_params)

    if @contact.save
      redirect_to contact_path, notice: "お問い合わせを送信しました。"
    else
      render :contact, status: :unprocessable_entity
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end
end
