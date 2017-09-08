//
//  PlaceModel.swift
//  Places
//
//  Created by Henry Xing on 4/2/2017.
//  Copyright © 2017 Razeware LLC. All rights reserved.
//

import Foundation

class PlaceModel {
  
  var name: String!
  var like: Int!
  var short: String!
  var long: String!
  var comments: [String]!
  
  
  init(name: String, like: Int, short: String, long: String, comments: [String]) {
    self.name = name
    self.short = short
    self.long = long
    self.like = like
    self.comments = comments
  }
}
