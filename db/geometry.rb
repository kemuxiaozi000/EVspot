class Ridgepole::DSLParser
  class TableDefinition
    TYPES.push(:geometry)
    def geometry(*args)
      options = args.extract_options!
      column_names = args
      column_names.each {|name| column(name, :geometry, options) }
    end
  end
end
