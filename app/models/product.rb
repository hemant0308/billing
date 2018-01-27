class Product < ApplicationRecord
  belongs_to :brand
  has_many :product_properties
  has_many :properties,through: :product_properties
end
